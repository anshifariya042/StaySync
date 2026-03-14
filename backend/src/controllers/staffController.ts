import { Request, Response } from "express";
import { User, UserRole, UserStatus } from "../models/User";
import bcrypt from "bcrypt";

// @desc    Add a new staff member
// @route   POST /api/hostels/staff
// @access  Private/Admin
export const addStaff = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, designation, tasks, hostelId } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Staff member already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staff = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: UserRole.STAFF,
            designation,
            tasks: tasks || [],
            hostelId,
            status: UserStatus.ACTIVE
        });

        res.status(201).json({
            message: "Staff member added successfully",
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                phone: staff.phone,
                designation: staff.designation,
                tasks: staff.tasks,
                status: staff.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Get all staff for a hostel
// @route   GET /api/hostels/:hostelId/staff
// @access  Private
export const getStaff = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        let query: any = {
            hostelId: req.params.hostelId,
            role: UserRole.STAFF
        };

        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { designation: searchRegex }
            ];
        }

        const staff = await User.find(query);

        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Update staff details
// @route   PUT /api/hostels/staff/:id
// @access  Private/Admin
export const updateStaff = async (req: Request, res: Response) => {
    try {
        const staff = await User.findById(req.params.id);
        if (!staff || staff.role !== UserRole.STAFF) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        const updatedStaff = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStaff);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// @desc    Remove a staff member
// @route   DELETE /api/hostels/staff/:id
// @access  Private/Admin
export const removeStaff = async (req: Request, res: Response) => {
    try {
        const staff = await User.findById(req.params.id);
        if (!staff || staff.role !== UserRole.STAFF) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        await staff.deleteOne();
        res.json({ message: "Staff member removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};
