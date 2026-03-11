import { Request, Response } from "express";
import { createHostelService } from "../services/hostelService";
import { registerUser } from "../services/authService";
import { UserRole } from "../models/User";
import hostelModel from "../models/hostelModel";

export const createHostel = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing. Ensure you are sending JSON or form-data correctly." });
    }

    const {
      name,
      ownerName,
      email,
      phone,
      location,
      description,
      totalRooms,
      facilities,
      roomTypes,
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
      facilities: Array.isArray(facilities) ? facilities : (facilities ? [facilities] : []),
      roomTypes: Array.isArray(roomTypes) ? roomTypes : (roomTypes ? [roomTypes] : []),
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




export const getAllHostels = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      location = "",
      facilities
    } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    if (location && location !== "All Locations") {
      query.location = { $regex: location, $options: "i" };
    }

    if (facilities) {
      const facilityArray = Array.isArray(facilities) ? facilities : (facilities as string).split(',');
      if (facilityArray.length > 0) {
        query.facilities = { $all: facilityArray };
      }
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const total = await hostelModel.countDocuments(query);
    const hostels = await hostelModel.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      hostels,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      total
    });

  } catch (error: any) {
    console.error("Fetch hostels error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch hostels"
    });
  }
};

export const getHostelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hostel = await hostelModel.findById(id);

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    res.status(200).json({ hostel });
  } catch (error: any) {
    console.error("Fetch hostel by ID error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch hostel details"
    });
  }
};