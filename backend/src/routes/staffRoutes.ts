import express from "express";
import { 
    getStaffStats, 
    getStaffTasks, 
    acceptTask, 
    updateTaskStatus 
} from "../controllers/staffDashboardController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/stats", protect, getStaffStats);
router.get("/tasks", protect, getStaffTasks);
router.put("/tasks/:id/accept", protect, acceptTask);
router.put("/tasks/:id/status", protect, updateTaskStatus);

export default router;
