import { Request, Response } from "express";
import { Complaint, ComplaintStatus } from "../models/Complaint";

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

        complaint.assignedStaff = staffId;
        // Automatically set to In Progress if it was Pending
        if (complaint.status === ComplaintStatus.PENDING) {
            complaint.status = ComplaintStatus.IN_PROGRESS;
        }

        await complaint.save();

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
        const user = await (require("../models/User").User).findById(userId).populate("roomId");
        if (!user || !user.hostelId) {
            return res.status(400).json({ message: "You must be assigned to a hostel to raise a complaint." });
        }

        const hostelId = user.hostelId;
        const roomNumber = user.roomId?.roomNumber || "General";

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

        res.status(201).json(complaint);
    } catch (error: any) {
        console.error("Complaint creation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
