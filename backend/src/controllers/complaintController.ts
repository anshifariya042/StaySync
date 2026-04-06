import { Request, Response } from "express";
import { Complaint, ComplaintStatus } from "../models/Complaint";
import Notification from "../models/Notification";
import { sendNotification } from "../sockets/socket";
import { User, UserRole } from "../models/User";
import Hostel from "../models/hostelModel";
import { sendComplaintAlertToAdmin, sendComplaintResolutionToUser } from "../utils/mailer";

// @desc    Get all complaints for a hostel
// @route   GET /api/hostels/:hostelId/complaints
// @access  Private
export const getComplaints = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, limit = 10, userId } = req.query;
        let query: any = { hostelId: req.params.hostelId };

        if (userId) {
            query.userId = userId;
        }

        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            query.$or = [
                { title: searchRegex },
                { roomNumber: searchRegex }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [complaints, totalCount] = await Promise.all([
            Complaint.find(query)
                .populate("userId", "name email profileImage")
                .populate("assignedStaff", "name email profileImage")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Complaint.countDocuments(query)
        ]);

        res.json({
            complaints,
            totalCount,
            totalPages: Math.ceil(totalCount / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/hostels/complaints/:id/status
// @access  Private/Admin
export const updateComplaintStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        if (!Object.values(ComplaintStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        complaint.status = status;
        await complaint.save();

        // NOTIFY USER IF RESOLVED
        if (status === ComplaintStatus.RESOLVED) {
            const user = await User.findById(complaint.userId);
            const hostel = await Hostel.findById(complaint.hostelId);
            
            if (user) {
                // APP NOTIFICATION
                const notification = new Notification({
                    userId: user._id,
                    type: "success",
                    title: "Complaint Resolved",
                    message: `Maintenance for your ticket "${complaint.title}" is complete.`,
                    isRead: false
                });
                await notification.save();

                // SOCKET EVENT
                sendNotification(user._id.toString(), "complaint-resolved", {
                    notificationId: notification._id,
                    title: notification.title,
                    message: notification.message,
                    complaintId: complaint._id
                });

                // EMAIL NOTIFICATION
                sendComplaintResolutionToUser(
                    user.email,
                    user.name,
                    complaint.title,
                    hostel?.name || "Your Residence"
                ).catch(err => console.error("Email Resolution Notification Error:", err));
            }
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Assign staff to complaint
// @route   PUT /api/hostels/complaints/:id/assign
// @access  Private/Admin
export const assignStaff = async (req: Request, res: Response) => {
    try {
        const { staffId } = req.body;

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        (complaint as any).assignedStaff = staffId;
        // Automatically set to In Progress if it was Pending
        if (complaint.status === ComplaintStatus.PENDING) {
            complaint.status = ComplaintStatus.IN_PROGRESS;
        }

        await complaint.save();

        // CREATE REAL-TIME NOTIFICATION
        console.log(`📡 Creating notification for staff [${staffId}] for task [${complaint.title}]`);
        const notification = new Notification({
            userId: staffId,
            type: "info",
            title: "New Task Assigned",
            message: `You have been assigned to: ${complaint.title} (Room ${complaint.roomNumber})`,
            isRead: false
        });

        await notification.save();

        // EMIT SOCKET EVENT
        sendNotification(staffId.toString(), "task-assigned", {
            notificationId: notification._id,
            title: notification.title,
            message: notification.message,
            taskDetails: {
                id: complaint._id,
                title: complaint.title,
                room: complaint.roomNumber
            }
        });

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Create a new complaint (for testing/admin logging)
// @route   POST /api/hostels/complaints
// @access  Private
export const createComplaint = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { title, description, category, priority } = req.body;


        // Fetch user to get hostelId and roomNumber if not provided
        const user = await User.findById(userId).populate("roomId");
        if (!user || !user.hostelId) {
            return res.status(400).json({ message: "You must be assigned to a hostel to raise a complaint." });
        }

        const hostelId = user.hostelId;
        const roomNumber =
        (user?.roomId as any)?.roomNumber || "General";
        // Handle Image Uploads
        const images = (req.files as any[])?.map(file => file.path) || [];

        // Generate Ticket ID
        const complaintId = `#CMP-${Math.floor(1000 + Math.random() * 9000)}`;

        const complaint = await Complaint.create({
            complaintId,
            title,
            description,
            category,
            priority: priority || "Normal",
            roomNumber: roomNumber.toString(),
            hostelId,
            userId,
            images,
            status: ComplaintStatus.PENDING
        });

        // NOTIFY HOSTEL ADMIN
        try {
            const admin = await User.findOne({ hostelId: hostelId, role: UserRole.ADMIN });
            const hostel = await Hostel.findById(hostelId);
            
            if (admin) {
                // APP NOTIFICATION
                const notification = new Notification({
                    userId: admin._id,
                    type: "info",
                    title: "New Support Ticket",
                    message: `Resident from Room ${roomNumber} raised: ${title}`,
                    isRead: false
                });
                await notification.save();

                // SOCKET EVENT
                sendNotification(admin._id.toString(), "new-complaint", {
                    notificationId: notification._id,
                    title: notification.title,
                    message: notification.message,
                    complaintId: complaint._id
                });

                // EMAIL NOTIFICATION
                sendComplaintAlertToAdmin(
                    admin.email,
                    user.name,
                    hostel?.name || "StaySync Residence",
                    title,
                    category
                ).catch(err => console.error("Email Complaint Alert Error:", err));
            }
        } catch (notifErr) {
            console.error("Delayed Notification Error:", (notifErr as Error).message);
        }

        res.status(201).json(complaint);
    } catch (error: any) {
        console.error("Complaint creation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get complaints assigned to the logged-in staff
// @route   GET /api/chat/staff/complaints
// @access  Private
export const getStaffComplaints = async (req: any, res: Response) => {
    try {
        const staffId = req.user.id;
        const complaints = await Complaint.find({ 
            assignedStaff: staffId,
            status: { $ne: ComplaintStatus.RESOLVED } 
        })
        .populate("userId", "name profileImage")
        .sort({ updatedAt: -1 });

        res.json({ success: true, data: complaints });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user's own complaints for chat
// @route   GET /api/user/complaints
// @access  Private
export const getUserComplaints = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const complaints = await Complaint.find({ userId })
            .populate("assignedStaff", "name role profileImage")
            .sort({ updatedAt: -1 });

        res.json({ success: true, data: complaints });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
