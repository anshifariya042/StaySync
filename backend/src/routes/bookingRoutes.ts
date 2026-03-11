import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { createBooking, getMyBookings } from "../controllers/bookingController";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);

export default router;
