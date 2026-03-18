import { Router } from "express";
import { register, login, googleLogin, refreshAccessToken, forgotPassword, verifyOTP, resetPassword } from "../controllers/authController";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/refresh", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);


export default router;
