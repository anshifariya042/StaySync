import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    totalRooms: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    facilities: [String],
    images: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Hostel", hostelSchema);
