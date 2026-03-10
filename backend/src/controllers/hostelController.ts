import { Request, Response } from "express";
import { createHostelService } from "../services/hostelService";
import { registerUser } from "../services/authService";
import { UserRole } from "../models/User";

export const createHostel = async (req: Request, res: Response) => {
  try {
    const {
      name,
      ownerName,
      email,
      phone,
      location,
      description,
      totalRooms,
      facilities,
      images,
      password
    } = req.body;

    let imageUrls: string[] = [];

    // If files are uploaded via multer
    if (req.files && Array.isArray(req.files)) {
      imageUrls = (req.files as Express.Multer.File[]).map(
        (file) => file.path
      );
    }
    // If image URLs are provided in the body
    else if (images && Array.isArray(images)) {
      imageUrls = images;
    } else if (typeof images === 'string') {
      imageUrls = [images];
    }

    const hostelData = {
      name,
      ownerName,
      email,
      phone,
      location,
      description,
      totalRooms: Number(totalRooms) || 0,
      facilities: Array.isArray(facilities) ? facilities : [],
      images: imageUrls,
      price: req.body.price || 0
    };

    const hostel = await createHostelService(hostelData);

    // If password is provided, create an admin user for this hostel
    if (password) {
      await registerUser({
        name: ownerName,
        email: email,
        password: password,
        role: UserRole.ADMIN,
        hostelId: hostel._id as any
      });
    }

    res.status(201).json({
      message: "Hostel registered successfully",
      hostel
    });
  } catch (error: any) {
    console.error("Hostel registration error:", error);
    res.status(500).json({ message: error.message || "Hostel registration failed" });
  }
};
