import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { UserRole, User } from "../models/User";

const router = express.Router();

// Only logged-in users
router.get("/profile", protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
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
