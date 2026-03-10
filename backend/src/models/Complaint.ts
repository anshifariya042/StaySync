import mongoose, { Document, Schema } from "mongoose";

export enum ComplaintStatus {
    PENDING = "Pending",
    IN_PROGRESS = "In Progress",
    RESOLVED = "Resolved",
}

export interface IComplaint extends Document {
    complaintId: string; // e.g., #CMP-1024
    title: string;
    description?: string;
    roomNumber: string;
    category: string; // Maintenance, Electrical, Housekeeping, Technical, etc.
    hostelId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    assignedStaff?: mongoose.Types.ObjectId;
    status: ComplaintStatus;
    reportedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
    {
        complaintId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String },
        roomNumber: { type: String, required: true },
        category: { type: String, required: true },
        hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: Object.values(ComplaintStatus),
            default: ComplaintStatus.PENDING,
        },
        reportedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Complaint = mongoose.model<IComplaint>("Complaint", complaintSchema);
