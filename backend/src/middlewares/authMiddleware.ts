import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request to include user
export interface AuthRequest extends Request {
  user?: any;
}
export const protect = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired" });
  }
};
