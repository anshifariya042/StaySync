import { Request, Response } from "express";
import { User, UserRole } from "../models/User";
import { Room, RoomStatus } from "../models/Room";
import { Complaint } from "../models/Complaint";
import Hostel from "../models/hostelModel";
import mongoose from "mongoose";

export const getDashboardOverview = async (req: any, res: Response) => {
    try {
        const hostelId = req.user.hostelId; // User must be logged in and belong to a hostel

        if (!hostelId) {
            res.status(403).json({ message: "No hostel linked to this account" });
            return;
        }

        // 1. Fetch Hostel details for totalRooms capacity
        const hostel = await Hostel.findById(hostelId);
        const totalRooms = hostel ? (hostel as any).totalRooms : 0;

        // 2. Occupied rooms
        const occupiedRooms = await Room.countDocuments({
            hostelId,
            status: RoomStatus.OCCUPIED
        });

        // 3. Pending complaints (Status that needs action)
        const pendingComplaints = await Complaint.countDocuments({
            hostelId,
            status: { $in: ["Pending", "High Priority", "In Progress"] }
        });

        // 4. Staff count
        const staffCount = await User.countDocuments({
            hostelId,
            role: UserRole.STAFF
        });

        // 5. Recent complaints list (e.g., last 4)
        const recentComplaints = await Complaint.find({ hostelId })
            .sort({ createdAt: -1 })
            .limit(4);

        res.status(200).json({
            stats: {
                totalRooms,
                occupiedRooms,
                pendingComplaints,
                staffCount,
                capacityPercentage: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0
            },
            recentComplaints: recentComplaints.map(c => ({
                id: c._id,
                title: c.title,
                room: c.roomNumber,
                status: c.status,
                time: c.createdAt // frontend formatting
            }))
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        res.json(complaint);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const assignStaff = async (req: Request, res: Response) => {
    try {
        const { staffId } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedStaff: staffId, status: "In Progress" },
            { new: true }
        ).populate('assignedStaff', 'name');
        
        if (!complaint) return res.status(404).json({ message: "Complaint not found" });
        res.json(complaint);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
