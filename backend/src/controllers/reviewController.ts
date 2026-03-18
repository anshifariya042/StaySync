import { Request, Response } from "express";
import { Review } from "../models/Review";
import Hostel from "../models/hostelModel";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { hostelId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!hostelId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // Check if user already reviewed this hostel
    const existingReview = await Review.findOne({ hostelId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this hostel" });
    }

    const review = await Review.create({
      hostelId,
      userId,
      rating,
      comment,
    });

    // Update hostel rating
    const reviews = await Review.find({ hostelId });
    const numberOfReviews = reviews.length;
    const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const averageRating = totalRating / numberOfReviews;

    await Hostel.findByIdAndUpdate(hostelId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      numberOfReviews,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHostelReviews = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;

    const reviews = await Review.find({ hostelId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    const hostelId = review.hostelId;
    await Review.findByIdAndDelete(id);

    // Update hostel rating
    const reviews = await Review.find({ hostelId });
    const numberOfReviews = reviews.length;
    let averageRating = 0;
    if (numberOfReviews > 0) {
      const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
      averageRating = totalRating / numberOfReviews;
    }

    await Hostel.findByIdAndUpdate(hostelId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      numberOfReviews,
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
