import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { UserRole } from "../models/User";


const router = express.Router();

// Only logged-in users
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Welcome! You are authenticated" });
});

// Only Admin (and Super Admin)
router.get(
  "/admin",
  protect,
  authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

// Admin + Staff + Super Admin
router.get(
  "/staff",
  protect,
  authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF),
  (req, res) => {
    res.json({ message: "Welcome Staff/Admin!" });
  }
);


export default router;
