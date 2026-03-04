import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";

const router = express.Router();

// Only logged-in users
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Welcome! You are authenticated" });
});

// Only Admin (and Super Admin)
router.get(
  "/admin",
  protect,
  authorizeRoles("superadmin", "admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

// Admin + Staff + Super Admin
router.get(
  "/staff",
  protect,
  authorizeRoles("superadmin", "admin", "staff"),
  (req, res) => {
    res.json({ message: "Welcome Staff/Admin!" });
  }
);


export default router;
