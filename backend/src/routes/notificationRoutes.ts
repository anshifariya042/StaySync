import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getUserNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.put("/mark-all-read", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);

export default router;
