import { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import { registerUser,loginUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);

    // Send refresh token in cookie
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.json({
      user: data.user,
      accessToken: data.accessToken,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

