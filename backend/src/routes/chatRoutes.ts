import express from "express";
import { getChatHistory, saveMessage } from "../controllers/chatController";
import { getStaffComplaints } from "../controllers/complaintController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/staff/complaints", protect, getStaffComplaints);
router.get("/:complaintId", protect, getChatHistory);
router.post("/", protect, saveMessage);

export default router;
