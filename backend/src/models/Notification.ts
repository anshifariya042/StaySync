import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: "info" | "success" | "warning" | "error";
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<INotification>("Notification", NotificationSchema);
