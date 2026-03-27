import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { User, IUser, UserRole, UserStatus } from "../models/User";
import { OTP } from "../models/OTP";
import { sendOTPEmail } from "../utils/mailer";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id.toString(), role: user.role, hostelId: user.hostelId?.toString() },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

import { registerSchema } from "../utils/validation";

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, name, role, hostelId, confirmPassword } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { ...req.body };
    delete userData.confirmPassword;

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    // Send refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.status(201).json({
      user,
      accessToken,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    if (user.status === UserStatus.REJECTED) {
      return res.status(403).json({ message: "Your registration has been rejected. Please contact support." });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Send refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.json({
      user,
      accessToken,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    );

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { accessToken } = generateTokens(user);

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid Google token payload");
    }

    const { email, name } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await User.create({
        name: name || "Google User",
        email: email,
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Send refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.json({
      user,
      accessToken,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save/Update OTP in DB
    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send Email
    await sendOTPEmail(email, otpCode);

    res.json({ message: "OTP sent to your email" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP again to be sure
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Session expired, please request a new OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP after successful reset
    await OTP.deleteOne({ email, otp });

    res.json({ message: "Password reset successful" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
