import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, UserRole, UserStatus } from "../models/User";
import hostelModel from "../models/hostelModel";
import { Room } from "../models/Room";
import Notification from "../models/Notification";
import { sendNotification } from "../sockets/socket";
import { sendNewHostelRegistrationEmail, sendRegistrationReceivedEmail } from "../utils/mailer";

export const createHostel = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);

    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing." });
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
      images,
      password,
      rooms // JSON string from frontend
    } = req.body;

    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
    } else if (images && Array.isArray(images)) {
      imageUrls = images;
    } else if (typeof images === 'string') {
      try {
          imageUrls = JSON.parse(images);
      } catch (e) {
          imageUrls = [images];
      }
    }

    // Parse rooms to get unique types
    let parsedRooms: any[] = [];
    let derivedRoomTypes: string[] = [];
    if (rooms) {
      try {
        parsedRooms = typeof rooms === 'string' ? JSON.parse(rooms) : rooms;
        derivedRoomTypes = [...new Set(parsedRooms.map((r: any) => r.type))];
      } catch (e) {
        console.error("Error parsing rooms:", e);
      }
    }

    const hostelData = {
      name,
      ownerName,
      email,
      phone,
      location,
      description,
      totalRooms: Number(totalRooms) || parsedRooms.length || 0,
      facilities: Array.isArray(facilities) ? facilities : (facilities ? [facilities] : []),
      roomTypes: derivedRoomTypes,
      images: imageUrls,
      price: req.body.price || (parsedRooms.length > 0 ? Math.min(...parsedRooms.map(r => r.price)) : 0)
    };

    const hostel = new hostelModel(hostelData);
    await hostel.save();

    // Create Admin User
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name: ownerName,
        email: email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        hostelId: hostel._id as any,
        status: UserStatus.PENDING
      });
    }

    // Create Rooms
    if (parsedRooms.length > 0) {
      const roomsToCreate = parsedRooms.map(r => ({
        ...r,
        hostelId: hostel._id,
        currentOccupants: 0
      }));
      await Room.insertMany(roomsToCreate);
    }

    // Notify Super Admins
    try {
        const superAdmins = await User.find({ role: UserRole.SUPER_ADMIN });
        
        for (const admin of superAdmins) {
            // App Notification Record
            const notif = await Notification.create({
                userId: admin._id,
                type: 'info',
                title: 'New Hostel Registration',
                message: `User ${ownerName} has registered a new hostel: "${name}". Check registrations for approval.`
            });

            // Real-time Socket Notification
            sendNotification(admin._id.toString(), "notification", {
                _id: notif._id,
                title: notif.title,
                message: notif.message,
                type: 'new_hostel', // Specific type for frontend filtering
                createdAt: notif.createdAt,
                isRead: false
            });

            // Email Notification to Super Admin
            await sendNewHostelRegistrationEmail(admin.email, ownerName, name, location);
        }

        // Email Notification to the Owner
        try {
            await sendRegistrationReceivedEmail(email, ownerName, name);
        } catch (ownerEmailError) {
            console.error("Failed to send confirmation email to owner:", ownerEmailError);
        }
    } catch (notifyError) {
        console.error("Failed to notify super admins of new registration:", notifyError);
    }

    res.status(201).json({
      message: "Hostel and rooms registered successfully",
      hostel
    });
  } catch (error: any) {
    console.error("Hostel registration error:", error);
    res.status(400).json({ message: error.message || "Hostel registration failed" });
  }
};




export const getAllHostels = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      location = "",
      facilities,
      minPrice,
      maxPrice
    } = req.query;

    const query: any = { status: 'approved' };

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

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
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

    if (hostel.status !== 'approved') {
      return res.status(403).json({ message: "This hostel is pending approval and not publicly visible." });
    }

    res.status(200).json({ hostel });
  } catch (error: any) {
    console.error("Fetch hostel by ID error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch hostel details"
    });
  }
};