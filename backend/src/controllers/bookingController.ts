import { Request, Response } from "express";
import { Booking, BookingStatus } from "../models/Booking";
import { Room, RoomStatus } from "../models/Room";
import { User, UserStatus, UserRole } from "../models/User";
import { sendBookingStatusEmail, sendNewBookingAlertToAdmin } from "../utils/mailer";
import { sendNotification } from "../sockets/socket";
import Notification from "../models/Notification";
import Hostel from "../models/hostelModel";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const {
            hostelId,
            roomId,
            fullName,
            email,
            phone,
            moveInDate,
            additionalNotes,
            totalAmount,
            advancePayment
        } = req.body;

        // Get Cloudinary URL from uploaded file
        const idProof = req.file ? (req.file as any).path : null;

        if (!idProof && !req.body.idProof) {
            // return res.status(400).json({ message: "ID proof is required." });
            console.log("No ID proof uploaded, continuing anyway for development...");
        }

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
            roomType: selectedRoomType,
            status: UserStatus.PENDING
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

        // Notify Hostel Admin(s)
        try {
            const hostelAdmins = await User.find({ hostelId: hostelId, role: UserRole.ADMIN });
            const hostel = await Hostel.findById(hostelId);
            
            for (const admin of hostelAdmins) {
                // Save notification to DB
                const notification = await Notification.create({
                    userId: admin._id,
                    title: "New Booking Request",
                    message: `A new booking has been requested by ${fullName} for a ${selectedRoomType} room.`,
                    type: "info"
                });

                // Real-time socket notification
                sendNotification(admin._id.toString(), "notification", {
                    _id: notification._id,
                    title: notification.title,
                    message: notification.message,
                    type: "new_booking",
                    createdAt: notification.createdAt,
                    isRead: false
                });

                // Email alert
                sendNewBookingAlertToAdmin(admin.email, fullName, hostel?.name || "StaySync", selectedRoomType).catch(console.error);
            }
        } catch (notifyError) {
            console.error("Failed to notify hostel admins of new booking:", notifyError);
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

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId).populate("hostelId");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Update booking status
        booking.status = status as BookingStatus;
        await booking.save();

        // Update user status
        const userStatus = status === BookingStatus.APPROVED ? UserStatus.ACTIVE : UserStatus.REJECTED;
        await User.findByIdAndUpdate(booking.userId, { status: userStatus });

        const user = await User.findById(booking.userId);
        const hostel = booking.hostelId as any;

        if (user) {
            const message = status === BookingStatus.APPROVED 
                ? `Your booking at ${hostel?.name || "StaySync"} has been approved!` 
                : `Your booking at ${hostel?.name || "StaySync"} has been rejected.`;

            // Save notification to DB
            await Notification.create({
                userId: user._id,
                title: status === BookingStatus.APPROVED ? "Booking Approved" : "Booking Rejected",
                message,
                type: status === BookingStatus.APPROVED ? "success" : "error"
            });

            // Real-time notification
            sendNotification(user._id.toString(), "booking-status-updated", {
                status,
                message
            });

            // Email alert
            sendBookingStatusEmail(user.email, user.name, status, hostel.name).catch(console.error);
        }

        res.status(200).json({ message: `Booking ${status} successfully`, booking });
    } catch (error: any) {
        console.error("Update booking status error:", error);
        res.status(500).json({ message: error.message || "Failed to update booking status" });
    }
};

export const updateResidentStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const userId = req.params.userId as string;

        // Find the most recent pending booking for this user
        const booking = await Booking.findOne({ 
            userId, 
            status: BookingStatus.PENDING 
        }).populate("hostelId");

        if (!booking) {
            // If no pending booking, it might already be confirmed or the user was added manually
            // We just update the user status directly in this case
            const userStatus = status === "approved" ? UserStatus.ACTIVE : UserStatus.REJECTED;
            const updatedUser = await User.findByIdAndUpdate(userId, { status: userStatus }, { new: true });
            
            if (updatedUser) {
                const message = status === "approved" 
                    ? `Your residency has been approved!` 
                    : `Your residency request has been rejected.`;

                await Notification.create({
                    userId,
                    title: status === "approved" ? "Residency Approved" : "Residency Rejected",
                    message,
                    type: status === "approved" ? "success" : "error"
                });

                 sendNotification(userId, "booking-status-updated", {
                    status,
                    message
                });
            }
            
            return res.status(200).json({ message: `Resident status updated to ${status}` });
        }

        // Reuse the logic from updateBookingStatus but with the found booking
        booking.status = status as BookingStatus;
        await booking.save();

        const userStatus = status === BookingStatus.APPROVED ? UserStatus.ACTIVE : UserStatus.REJECTED;
        await User.findByIdAndUpdate(userId, { status: userStatus });

        const user = await User.findById(userId);
        const hostel = booking.hostelId as any;

        if (user) {
            const message = status === BookingStatus.APPROVED 
                ? `Your booking at ${hostel?.name || "StaySync"} has been approved!` 
                : `Your booking at ${hostel?.name || "StaySync"} has been rejected.`;

            await Notification.create({
                userId,
                title: status === BookingStatus.APPROVED ? "Residency Approved" : "Residency Rejected",
                message,
                type: status === BookingStatus.APPROVED ? "success" : "error"
            });

            sendNotification(user._id.toString(), "booking-status-updated", {
                status,
                message
            });

            sendBookingStatusEmail(user.email, user.name, status, hostel?.name || "StaySync").catch(console.error);
        }

        res.status(200).json({ message: `Resident status updated to ${status}`, booking });
    } catch (error: any) {
        console.error("Update resident status error:", error);
        res.status(500).json({ message: error.message || "Failed to update resident status" });
    }
};

