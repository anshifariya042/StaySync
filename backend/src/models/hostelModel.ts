import mongoose, { Schema, Document } from "mongoose";

export interface IHostel extends Document {
  name: string;
  location: string;
  createdBy: mongoose.Types.ObjectId;
  isApproved: boolean;
}

const hostelSchema = new Schema<IHostel>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Hostel = mongoose.model<IHostel>("Hostel", hostelSchema);
