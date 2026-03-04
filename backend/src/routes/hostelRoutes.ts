import express from "express";
import { protect } from "../middlewares/authmiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import {
  registerHostel,
  listPendingHostels,
  approveHostel,
} from "../controllers/hostelController";

const router = express.Router();

// Admin registers hostel
router.post("/", protect, authorizeRoles("admin"), registerHostel);

// SuperAdmin views pending
router.get("/pending", protect, authorizeRoles("superadmin"), listPendingHostels);

// SuperAdmin approves hostel
router.patch("/approve/:id", protect, authorizeRoles("superadmin"), approveHostel);

export default router;
