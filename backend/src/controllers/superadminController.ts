import { Request, Response } from "express";
import { User, UserRole, UserStatus } from "../models/User";
import Hostel from "../models/hostelModel";
import { Complaint, ComplaintStatus } from "../models/Complaint";
import { sendHostelApprovalEmail } from "../utils/mailer";
import Notification from "../models/Notification";
import { sendNotification } from "../sockets/socket";

export const getSuperAdminDashboard = async (req: Request, res: Response) => {
    try {
        // Stats
        const registeredHostelsCount = await Hostel.countDocuments();
        const pendingApprovalsCount = await User.countDocuments({
            role: UserRole.ADMIN,
            status: UserStatus.PENDING
        });
        const activeUsersCount = await User.countDocuments({
            role: UserRole.USER,
            status: UserStatus.ACTIVE
        });
        const totalComplaintsCount = await Complaint.countDocuments();

        // Top Rated Hostels
        const topRatedHostels = await Hostel.find()
            .sort({ averageRating: -1 })
            .limit(5)
            .select('name averageRating');

        // Registration, Complaint & Resolution Trends (Last 8 Days)
        const registrationTrends = [];
        const complaintTrends = [];
        const resolutionTrends = [];
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const today = new Date();

        for (let i = 7; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const day = d.getDate();
            const month = monthNames[d.getMonth()];

            const startOfDay = new Date(d);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(d);
            endOfDay.setHours(23, 59, 59, 999);

            // Registration Count
            const regCount = await Hostel.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            // Complaint Total Count
            const totalCompCount = await Complaint.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            // Resolution Count
            const resCount = await Complaint.countDocuments({
                status: ComplaintStatus.RESOLVED,
                updatedAt: { $gte: startOfDay, $lte: endOfDay }
            });

            const label = `${day} ${month}`;

            registrationTrends.push({ label, count: regCount });
            complaintTrends.push({ label, count: totalCompCount });
            resolutionTrends.push({ label, count: resCount });
        }

        // Recent Activity (Merge recent users and recent complaints)
        const recentAdmins = await User.find({ role: UserRole.ADMIN })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('hostelId', 'name location');

        const recentComplaints = await Complaint.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('userId', 'name');

        const recentUsers = await User.find({ role: UserRole.USER })
            .sort({ createdAt: -1 })
            .limit(3);

        const recentActivity = [
            ...recentAdmins.map((admin: any) => ({
                id: admin._id,
                type: 'admin_registration',
                title: `${admin.name} submitted a new registration request.`,
                subtitle: admin.hostelId ? (admin.hostelId as any).name : 'No Hostel',
                date: admin.createdAt,
            })),
            ...recentComplaints.map((comp: any) => ({
                id: comp._id,
                type: 'complaint',
                title: `${(comp.userId as any)?.name || 'Someone'} filed a complaint.`,
                subtitle: comp.title,
                date: comp.createdAt,
            })),
            ...recentUsers.map((user: any) => ({
                id: user._id,
                type: 'new_user',
                title: `New user ${user.name} joined the platform.`,
                subtitle: 'Growth Trend',
                date: user.createdAt,
            }))
        ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5); // Take top 5

        res.status(200).json({
            stats: {
                registeredHostels: registeredHostelsCount,
                pendingApprovals: pendingApprovalsCount,
                activeUsers: activeUsersCount,
                totalComplaints: totalComplaintsCount,
            },
            topRatedHostels,
            complaintTrends,
            registrationTrends,
            resolutionTrends,
            recentActivity
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getHostelApprovals = async (req: Request, res: Response) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        let query: any = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { ownerName: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const total = await Hostel.countDocuments(query);
        const hostels = await Hostel.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            hostels,
            total,
            totalPages: Math.ceil(total / limitNumber),
            currentPage: pageNumber
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const approveRejectHostel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const hostel = await Hostel.findByIdAndUpdate(id, { status }, { new: true });
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        // Also update the associated admin user status
        const userStatus = status === 'approved' ? UserStatus.ACTIVE : UserStatus.REJECTED;
        const user = await User.findOneAndUpdate(
            { hostelId: id, role: UserRole.ADMIN },
            { status: userStatus },
            { new: true }
        );

        // Send Notifications if user found
        if (user) {
            try {
                // Email Notification
                await sendHostelApprovalEmail(user.email, user.name, status, hostel.name);

                // App Notification (Internal Record)
                const notif = await Notification.create({
                    userId: user._id,
                    type: status === 'approved' ? 'success' : 'error',
                    title: status === 'approved' ? 'Hostel Approved' : 'Registration Rejected',
                    message: status === 'approved'
                        ? `Congratulations! Your hostel "${hostel.name}" has been approved.`
                        : `Your registration for "${hostel.name}" was rejected by the Super Admin.`
                });

                // App Notification (Real-time Socket)
                sendNotification(user._id.toString(), "notification", {
                    _id: notif._id,
                    title: notif.title,
                    message: notif.message,
                    type: notif.type,
                    createdAt: notif.createdAt,
                    isRead: false
                });

            } catch (notifyError) {
                console.error("Failed to send notifications:", notifyError);
                // We don't fail the whole request just because notifications failed
            }
        }

        res.status(200).json({ message: `Hostel ${status} successfully`, hostel });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search, role, hostel, page = 1, limit = 10 } = req.query;
        let query: any = {};

        if (typeof role === "string" && role !== "All Roles") {
         query.role = role.toLowerCase();
         }


        if (hostel && hostel !== 'All Hostels') {
            query.hostelId = hostel;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate('hostelId', 'name');

        res.status(200).json({
            users,
            total,
            activeCount: await User.countDocuments({ status: UserStatus.ACTIVE }),
            pendingCount: await User.countDocuments({ status: UserStatus.PENDING }),
            totalPages: Math.ceil(total / limitNumber),
            currentPage: pageNumber
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: `User status updated to ${status}`, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getHostelsList = async (req: Request, res: Response) => {
    try {
        const hostels = await Hostel.find({}, 'name _id');
        res.status(200).json(hostels);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllComplaints = async (req: Request, res: Response) => {
    try {
        const { search, status, category, hostelId, page = 1, limit = 10 } = req.query;
        let query: any = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (hostelId && hostelId !== 'All') {
            query.hostelId = hostelId;
        }

        if (search) {
            query.$or = [
                { complaintId: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } }
            ];
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const total = await Complaint.countDocuments(query);
        const complaints = await Complaint.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate('hostelId', 'name')
            .populate('userId', 'name email')
            .populate('assignedStaff', 'name');

        const stats = {
            total: await Complaint.countDocuments(query),
            pending: await Complaint.countDocuments({ ...query, status: ComplaintStatus.PENDING }),
            inProgress: await Complaint.countDocuments({ ...query, status: ComplaintStatus.IN_PROGRESS }),
            resolved: await Complaint.countDocuments({ ...query, status: ComplaintStatus.RESOLVED }),
            categories: await Complaint.aggregate([
                { $match: query },
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ])
        };

        res.status(200).json({
            complaints,
            total,
            stats,
            totalPages: Math.ceil(total / limitNumber),
            currentPage: pageNumber
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
