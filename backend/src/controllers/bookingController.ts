import { Request, Response } from "express";
import { Booking, BookingStatus } from "../models/Booking";
import { Room, RoomStatus } from "../models/Room";
import { User } from "../models/User";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const {
            hostelId,
            roomId,
            fullName,
            email,
            phone,
            moveInDate,
            idProof,
            additionalNotes,
            totalAmount,
            advancePayment
        } = req.body;

        // Check if user is authenticated
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please login to book a room." });
        }

        let validatedRoomId = roomId;
        let selectedRoomType = req.body.roomType;

        if (roomId && roomId !== 'default') {
            // Check if room is available
            const room = await Room.findById(roomId);
            if (!room || room.status !== RoomStatus.AVAILABLE) {
                return res.status(400).json({ message: "Room is not available for booking." });
            }
            validatedRoomId = room._id;
            selectedRoomType = room.type;
        } else {
            validatedRoomId = null;
        }

        const booking = await Booking.create({
            userId,
            hostelId,
            roomId: validatedRoomId,
            roomType: selectedRoomType,
            fullName,
            email,
            phone,
            moveInDate,
            idProof,
            additionalNotes,
            totalAmount,
            advancePayment,
            status: BookingStatus.PENDING
        });

        // Update User profile to link with the hostel and room
        await User.findByIdAndUpdate(userId, {
            hostelId: hostelId,
            roomId: validatedRoomId,
            roomType: selectedRoomType
        });

        // Update room occupancy if a room was selected
        if (validatedRoomId) {
            const room = await Room.findById(validatedRoomId);
            if (room) {
                room.currentOccupants += 1;
                if (room.currentOccupants >= room.capacity) {
                    room.status = RoomStatus.OCCUPIED;
                }
                await room.save();
            }
        }

        res.status(201).json({
            message: "Booking request submitted successfully!",
            booking
        });
    } catch (error: any) {
        console.error("Create booking error:", error);
        res.status(500).json({ message: error.message || "Failed to create booking" });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const bookings = await Booking.find({ userId }).populate("hostelId").populate("roomId");
        res.status(200).json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch bookings" });
    }
};
