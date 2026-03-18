import express from "express";
import { addReview, getHostelReviews, deleteReview } from "../controllers/reviewController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/hostel/:hostelId", getHostelReviews);
router.delete("/:id", protect, deleteReview);

export default router;
