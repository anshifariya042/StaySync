import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { UserRole, User } from "../models/User";

const router = express.Router();

// Only logged-in users
router.get("/profile", protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("hostelId")
      .populate("roomId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/profile", protect, async (req: any, res) => {
  try {
    const { name, email, phone, profileImage } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User find failed" });
    }

    // Update fields if provided in request body
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    
    // Repopulate to return full user object consistent with GET /profile
    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("hostelId")
      .populate("roomId");
      
    res.json(updatedUser);
  } catch (err: any) {
    console.error("Profile update error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
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
