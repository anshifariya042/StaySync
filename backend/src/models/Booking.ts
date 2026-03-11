import mongoose, { Document, Schema } from "mongoose";

export enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    hostelId: mongoose.Types.ObjectId;
    roomId?: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    moveInDate: Date;
    idProof: string;
    additionalNotes?: string;
    totalAmount: number;
    advancePayment: number;
    roomType?: string;
    status: BookingStatus;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        moveInDate: { type: Date, required: true },
        idProof: { type: String },
        additionalNotes: { type: String },
        totalAmount: { type: Number, required: true },
        advancePayment: { type: Number, required: true },
        roomType: { type: String },
        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PENDING
        }
    },
    { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
