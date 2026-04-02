import mongoose, { Document, Schema } from "mongoose";

export interface IChatMessage extends Document {
    complaintId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
    messageType: "text" | "image" | "file";
    fileUrl?: string;
    isRead: boolean;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
    {
        complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        messageType: { type: String, enum: ["text", "image", "file"], default: "text" },
        fileUrl: { type: String },
        isRead: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Indexes for faster lookups
chatMessageSchema.index({ complaintId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);
