import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  hostelId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent multiple reviews from the same user for the same hostel
reviewSchema.index({ hostelId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
