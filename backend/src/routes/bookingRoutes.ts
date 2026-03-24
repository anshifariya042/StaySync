import express from "express";
import { protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/upload";
import { createBooking, getMyBookings, updateBookingStatus, updateResidentStatus } from "../controllers/bookingController";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "../models/User";

const router = express.Router();

router.post("/", protect, upload.single("idProof"), createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.put("/:id/status", protect, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateBookingStatus);
router.put("/user/:userId/status", protect, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), updateResidentStatus);

export default router;
