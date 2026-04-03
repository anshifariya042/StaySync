import { Request, Response } from "express";
import { User, UserRole, UserStatus } from "../models/User";
import { Room, RoomStatus } from "../models/Room";
import { Booking, BookingStatus } from "../models/Booking";
import bcrypt from "bcrypt";
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
        const { search } = req.query;
        let query: any = {
            hostelId: req.params.hostelId,
            role: UserRole.USER
        };

        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];

        }

        let residents = await User.find(query).populate('roomId', 'roomNumber');


        if (search) {
            const searchStr = (search as string).toLowerCase();
            residents = residents.filter(resident =>
                (resident.name && resident.name.toLowerCase().includes(searchStr)) ||
                (resident.email && resident.email.toLowerCase().includes(searchStr)) ||
                (resident.roomId && (resident.roomId as any).roomNumber && (resident.roomId as any).roomNumber.toString().toLowerCase().includes(searchStr))
            );
        }

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

        // 1. If resident was in a room, update occupancy
        if (resident.roomId) {
            const room = await Room.findById(resident.roomId);
            if (room && room.currentOccupants > 0) {
                room.currentOccupants -= 1;
                if (room.currentOccupants < room.capacity) {
                    room.status = RoomStatus.AVAILABLE;
                }
                await room.save();
            }
        }

        // 2. Mark active bookings as COMPLETED (vacated)
        await Booking.updateMany(
            {
                userId: resident._id,
                hostelId: resident.hostelId, // Only mark bookings for the current hostel as completed
                status: { $in: [BookingStatus.APPROVED, BookingStatus.CONFIRMED, BookingStatus.PENDING] }
            },
            { $set: { status: BookingStatus.COMPLETED } }
        );

        // 3. Clear user's residency details but keep them active
        resident.roomId = undefined;
        // resident.hostelId = undefined; // We can set it to undefined, but mongoose needs unset. Better to use findByIdAndUpdate or unset explicitly
        // If we just assign undefined, mongoose often handles it, but let's be explicitly clear.

        await User.findByIdAndUpdate(resident._id, {
            $unset: { roomId: "", hostelId: "", roomType: "" },
            $set: { status: UserStatus.ACTIVE }
        });

        res.json({ message: "Resident vacated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};
