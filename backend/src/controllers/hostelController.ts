import { Request, Response, NextFunction, RequestHandler } from "express";
import * as hostelService from "../services/hostelService";

/**
 * Extend Request to include logged-in user (added by protect middleware)
 */
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Params type for routes using :id
 */
interface IdParams {
  id: string;
}

/**
 * 🔹 Register Hostel (Admin creates hostel → Pending Approval)
 */
export const registerHostel: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const hostel = await hostelService.createHostel({
      ...req.body,
      createdBy: authReq.user.id,
    });

    res.status(201).json({
      message: "Hostel registered successfully. Waiting for approval.",
      hostel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔹 SuperAdmin → View all pending hostels
 */
export const listPendingHostels: RequestHandler = async (
  _req,
  res,
  next
) => {
  try {
    const hostels = await hostelService.getPendingHostels();

    res.status(200).json({
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔹 SuperAdmin → Approve Hostel
 */
export const approveHostel: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params; // ✅ Now TS knows id is string

    const hostel = await hostelService.approveHostel(id);

    if (!hostel) {
      res.status(404).json({ message: "Hostel not found" });
      return;
    }

    res.status(200).json({
      message: "Hostel approved successfully",
      hostel,
    });
  } catch (error) {
    next(error);
  }
};
