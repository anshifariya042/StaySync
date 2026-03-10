import express from "express";
import { getDashboardOverview } from "../controllers/adminController";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "../models/User";

const router = express.Router();

// Get Dashboard Overview
// Protected to logged-in users who are admins
router.get(
    "/dashboard-overview",
    protect,
    authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getDashboardOverview
);

export default router;
