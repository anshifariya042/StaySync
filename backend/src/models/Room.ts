import mongoose, { Document, Schema } from "mongoose";

export enum RoomStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    MAINTENANCE = "maintenance",
}

export interface IRoom extends Document {
    roomNumber: string;
    hostelId: mongoose.Types.ObjectId;
    status: RoomStatus;
    capacity: number;
    currentOccupants: number;
    type: string;
    price: number;
}

const roomSchema = new Schema<IRoom>(
    {
        roomNumber: { type: String, required: true },
        hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
        status: {
            type: String,
            enum: Object.values(RoomStatus),
            default: RoomStatus.AVAILABLE,
        },
        capacity: { type: Number, required: true, default: 1 },
        currentOccupants: { type: Number, required: true, default: 0 },
        type: { type: String, default: "Standard" },
        price: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Room = mongoose.model<IRoom>("Room", roomSchema);
