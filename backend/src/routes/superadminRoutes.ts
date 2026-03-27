import express from "express";
import { getSuperAdminDashboard, getHostelApprovals, approveRejectHostel, getAllUsers, updateUserStatus, getHostelsList, getAllComplaints } from "../controllers/superadminController";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "../models/User";

const router = express.Router();

// Get Super Admin Dashboard Overview
router.get(
    "/dashboard-overview",
    protect,
    authorizeRoles(UserRole.SUPER_ADMIN),
    getSuperAdminDashboard
);

// Hostel Approvals
router.get(
    "/hostel-approvals",
    protect,
    authorizeRoles(UserRole.SUPER_ADMIN),
    getHostelApprovals
);

router.put(
    "/approve-hostel/:id",
    protect,
    authorizeRoles(UserRole.SUPER_ADMIN),
    approveRejectHostel
);

// User Management
router.get(
    "/users",
    protect,
    authorizeRoles(UserRole.SUPER_ADMIN),
    getAllUsers
);

router.put(
    "/users/status/:id",
    protect,
    authorizeRoles(UserRole.SUPER_ADMIN),
    updateUserStatus
);

router.get(
    "/hostels-list",
    protect,
    authorizeRoles(UserRole.SUPER_ADMIN),
    getHostelsList
);

router.get(
    "/complaints",
    protect,
    authorizeRoles(UserRole.SUPER_ADMIN),
    getAllComplaints
);

export default router;
