import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  STAFF = "staff",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  MOVE_OUT_PENDING = "move-out pending",
  ON_LEAVE = "on leave",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  designation?: string; // e.g., Front Desk Manager, Maintenance Lead
  tasks?: string[]; // e.g., ["Check-ins", "Billing"]
  hostelId?: mongoose.Types.ObjectId;
  roomId?: mongoose.Types.ObjectId;
  roomType?: string;
  status: UserStatus;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    designation: { type: String },
    tasks: [{ type: String }],
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    roomType: { type: String },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
