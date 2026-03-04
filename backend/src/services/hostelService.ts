import { Hostel } from "../models/hostelModel";

interface CreateHostelInput {
  name: string;
  location: string;
  createdBy: string;
  [key: string]: any;
}

/**
 * Create Hostel → Default isApproved = false
 */
export const createHostel = async (data: CreateHostelInput) => {
  return await Hostel.create({
    ...data,
    isApproved: false,
  });
};

/**
 * Get all pending hostels
 */
export const getPendingHostels = async () => {
  return await Hostel.find({ isApproved: false }).populate(
    "createdBy",
    "name email"
  );
};

/**
 * Approve hostel by ID
 */
export const approveHostel = async (id: string) => {
  return await Hostel.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  );
};
