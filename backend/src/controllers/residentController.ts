import { Request, Response } from "express";
import { User, UserRole, UserStatus } from "../models/User";
import { Room } from "../models/Room";
import bcrypt from "bcrypt";

// @desc    Add a new resident
// @route   POST /api/hostels/residents
// @access  Private/Admin
export const addResident = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, roomId, hostelId } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if room has space
        if (roomId) {
            const room = await Room.findById(roomId);
            if (!room) return res.status(404).json({ message: "Room not found" });
            if (room.currentOccupants >= room.capacity) {
                return res.status(400).json({ message: "Room is already at full capacity" });
            }

            // Update room occupancy
            room.currentOccupants += 1;
            await room.save();
        }

        const resident = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: UserRole.USER,
            hostelId,
            roomId,
            status: UserStatus.ACTIVE
        });

        res.status(201).json({
            message: "Resident added successfully",
            resident: {
                id: resident._id,
                name: resident.name,
                email: resident.email,
                phone: resident.phone,
                roomId: resident.roomId,
                status: resident.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Get all residents for a hostel
// @route   GET /api/hostels/:hostelId/residents
// @access  Private
export const getResidents = async (req: Request, res: Response) => {
    try {
        const residents = await User.find({
            hostelId: req.params.hostelId,
            role: UserRole.USER
        }).populate('roomId', 'roomNumber');

        res.json(residents);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Remove a resident
// @route   DELETE /api/hostels/residents/:id
// @access  Private/Admin
export const removeResident = async (req: Request, res: Response) => {
    try {
        const resident = await User.findById(req.params.id);
        if (!resident || resident.role !== UserRole.USER) {
            return res.status(404).json({ message: "Resident not found" });
        }

        // If resident was in a room, update occupancy
        if (resident.roomId) {
            const room = await Room.findById(resident.roomId);
            if (room && room.currentOccupants > 0) {
                room.currentOccupants -= 1;
                await room.save();
            }
        }

        await resident.deleteOne();
        res.json({ message: "Resident removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};
