import { Response, NextFunction } from "express";
import { AuthRequest } from "./authmiddleware";

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Forbidden" });
    }
    next();
  };
};
