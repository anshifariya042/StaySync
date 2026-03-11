import { Request, Response } from "express";
import { Room, RoomStatus } from "../models/Room";

// @desc    Add a new room
// @route   POST /api/hostels/rooms
// @access  Private/Admin
export const addRoom = async (req: Request, res: Response) => {
    try {
        const { roomNumber, hostelId, type, price, status, capacity } = req.body;

        const roomExists = await Room.findOne({ roomNumber, hostelId });
        if (roomExists) {
            return res.status(400).json({ message: "Room already exists in this hostel" });
        }

        const room = await Room.create({
            roomNumber,
            hostelId,
            type: type || "Standard",
            price: price || 0,
            status: status || RoomStatus.AVAILABLE,
            capacity: capacity || 1,
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Get all rooms for a hostel
// @route   GET /api/hostels/:hostelId/rooms
// @access  Private
export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find({ hostelId: req.params.hostelId });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Update a room
// @route   PUT /api/hostels/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRoom);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Delete a room
// @route   DELETE /api/hostels/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.deleteOne();
        res.json({ message: "Room removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};
