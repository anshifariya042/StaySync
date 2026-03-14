import express from "express";
import { protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/upload";
import { createBooking, getMyBookings } from "../controllers/bookingController";

const router = express.Router();

router.post("/", protect, upload.single("idProof"), createBooking);
router.get("/my-bookings", protect, getMyBookings);

export default router;
