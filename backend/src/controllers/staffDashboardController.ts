import { Response } from "express";
import { Complaint, ComplaintStatus } from "../models/Complaint";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getStaffStats = async (req: AuthRequest, res: Response) => {
    try {
        const staffId = req.user.id;
        const hostelId = req.user.hostelId;

        // Tasks assigned to this staff
        const total = await Complaint.countDocuments({ assignedStaff: staffId });
        const pending = await Complaint.countDocuments({ assignedStaff: staffId, status: ComplaintStatus.PENDING });
        const inProgress = await Complaint.countDocuments({ assignedStaff: staffId, status: ComplaintStatus.IN_PROGRESS });
        const resolved = await Complaint.countDocuments({ assignedStaff: staffId, status: ComplaintStatus.RESOLVED });

        // Unassigned tasks in the same hostel (waitlist)
        const waitlist = await Complaint.countDocuments({ hostelId, assignedStaff: { $exists: false }, status: ComplaintStatus.PENDING });

        res.json({
            assigned: total,
            pending: pending,
            inProgress,
            resolved,
            waitlist
        });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getStaffTasks = async (req: AuthRequest, res: Response) => {
    try {
        const staffId = req.user.id;
        const hostelId = req.user.hostelId;
        const { status, priority, search, limit = 10 } = req.query;

        let query: any = { 
            hostelId,
            $or: [
                { assignedStaff: staffId },
                { assignedStaff: { $exists: false } } // Also show unassigned tasks in the hostel
            ]
        };

        if (status && status !== "All") query.status = status;
        if (priority) query.priority = priority;
        
        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            // If already has $or (the assignment check), we need to handle it carefully
            // In MongoDB, we can use $and with the existing query
            const searchQuery = {
                $or: [
                    { title: searchRegex },
                    { roomNumber: searchRegex },
                    { complaintId: searchRegex }
                ]
            };
            
            // Re-structure query to use $and
            const originalQuery = { ...query };
            query = {
                $and: [
                    originalQuery,
                    searchQuery
                ]
            };
        }

        const tasks = await Complaint.find(query)
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(Number(limit));

        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const acceptTask = async (req: AuthRequest, res: Response) => {
    try {
        const staffId = req.user.id;
        const taskId = req.params.id;

        const task = await Complaint.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.assignedStaff) {
            return res.status(400).json({ message: "Task already assigned" });
        }

        task.assignedStaff = staffId;
        task.status = ComplaintStatus.IN_PROGRESS;
        await task.save();

        res.json(task);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
    try {
        const staffId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        const task = await Complaint.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.assignedStaff?.toString() !== staffId) {
            return res.status(403).json({ message: "You are not assigned to this task" });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
