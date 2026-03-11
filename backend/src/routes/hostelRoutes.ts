import express from "express";
import upload from "../middlewares/upload";
import { createHostel, getAllHostels } from "../controllers/hostelController";
import { addRoom, getRooms, updateRoom, deleteRoom } from "../controllers/roomController";
import { addResident, getResidents, removeResident } from "../controllers/residentController";
import { getComplaints, updateComplaintStatus, assignStaff, createComplaint } from "../controllers/complaintController";
import { addStaff, getStaff, updateStaff, removeStaff } from "../controllers/staffController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// router.post("/add-hostel", upload.array("images", 5), createHostel);
router.post("/register-hostel", upload.array("images", 5), createHostel);
router.get("/", getAllHostels);

// Room routes
router.post("/rooms", protect, addRoom);
router.get("/:hostelId/rooms", protect, getRooms);
router.put("/rooms/:id", protect, updateRoom);
router.delete("/rooms/:id", protect, deleteRoom);

// Resident routes
router.post("/residents", protect, addResident);
router.get("/:hostelId/residents", protect, getResidents);
router.delete("/residents/:id", protect, removeResident);

// Complaint routes
router.get("/:hostelId/complaints", protect, getComplaints);
router.post("/complaints", protect, createComplaint);
router.put("/complaints/:id/status", protect, updateComplaintStatus);
router.put("/complaints/:id/assign", protect, assignStaff);

// Staff routes
router.post("/staff", protect, addStaff);
router.get("/:hostelId/staff", protect, getStaff);
router.put("/staff/:id", protect, updateStaff);
router.delete("/staff/:id", protect, removeStaff);

export default router;
