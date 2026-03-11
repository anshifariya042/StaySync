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

// Get all hostels (temporary static data)
// export const getAllHostels = async (req: Request, res: Response) => {
//   try {
//     const hostels = [
//       {
//         _id: '1',
//         name: 'Elite Living Heights',
//         location: 'Upper East Side, New York',
//         price: 450,
//         image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp8Oe3I1AZBHsQGoW6t-X-7_-0MX5fKNQO94VrMaPpv4UZ5H217PgAwMO0LkSY3_alTTvcK3_boq6YRDswJulXagHoIxkIlpgGqNjR0M0vcobiqbI6cgTNpTaUGoxK9FAlOIbVaC6unZ1HFADskpl0n0_TFBAEdx_mYk0BmYjf1JFVUXUCWKkZkcvUECD8iblLrf7Nx-X6i8Bb7lpyYrSL_a9sqCTmPGMfz35D5Hv2o9vG5efDLX2RAa0bDbmshFvZZo2lUW9mYDg',
//         rating: 4.8,
//         facilities: ['WiFi', 'Mess', 'Security']
//       },
//       {
//         _id: '2',
//         name: 'Oxford Student Suites',
//         location: 'Central London, UK',
//         price: 380,
//         image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4CI2FOcLrs7-FxT0c5qqoxkgww20I791aNiM2HQ_l_XuqilLIcBRBEBtNH2-wfeEr1rk6AVDG6RpycPGa4MDM8emMYbE48jOgEG8qmAg7Fh2UHl0nHmWGYDZ21lA6wMgHna3JhxMGSwLf8ljy8xOX23rC-xK6LIsTruVRfbxmLxOCRcnp3am0tggpF36r2_r5Bj4jznQZT0S9cY83GmKxU07D3RXYmp-_2hwN-JIjI9r80rnRMC_2Gv07_qi_yVFmAR9fs3yCJ-k',
//         rating: 4.5,
//         facilities: ['Laundry', 'Gym']
//       }
//     ];
//     res.status(200).json({ hostels });
//   } catch (error: any) {
//     console.error('Get hostels error:', error);
//     res.status(500).json({ message: error.message || 'Failed to fetch hostels' });
//   }
// };


export const getAllHostels = async (req: Request, res: Response) => {
  try {
    const hostels = await hostelModel.find();

    res.status(200).json({
      hostels
    });

  } catch (error: any) {
    console.error("Fetch hostels error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch hostels"
    });
  }
};