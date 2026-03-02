import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  STAFF = "staff",
  USER = "user",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  hostelId?: mongoose.Types.ObjectId; // linked for admin/staff/users
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
