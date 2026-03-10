import { Request, Response } from "express";
import { Complaint, ComplaintStatus } from "../models/Complaint";

// @desc    Get all complaints for a hostel
// @route   GET /api/hostels/:hostelId/complaints
// @access  Private
export const getComplaints = async (req: Request, res: Response) => {
    try {
        const complaints = await Complaint.find({ hostelId: req.params.hostelId })
            .populate("userId", "name email profileImage")
            .populate("assignedStaff", "name email profileImage")
            .sort({ createdAt: -1 });

        res.json(complaints);
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
export const createComplaint = async (req: Request, res: Response) => {
    try {
        const { title, roomNumber, category, hostelId, userId, description } = req.body;

        // Generate a simple ticket ID: #CMP- + random 4 digits
        const complaintId = `#CMP-${Math.floor(1000 + Math.random() * 9000)}`;

        const complaint = await Complaint.create({
            complaintId,
            title,
            roomNumber,
            category,
            hostelId,
            userId,
            description,
            status: ComplaintStatus.PENDING
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};
