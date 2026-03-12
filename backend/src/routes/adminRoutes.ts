import express from "express";
import { getDashboardOverview, updateComplaintStatus, assignStaff } from "../controllers/adminController";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "../models/User";

const router = express.Router();

// Get Dashboard Overview
router.get(
    "/dashboard-overview",
    protect,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getDashboardOverview
);

// Update complaint status
router.put(
    "/complaints/:id/status",
    protect,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    updateComplaintStatus
);

// Assign staff to complaint
router.put(
    "/complaints/:id/assign",
    protect,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    assignStaff
);

export default router;
