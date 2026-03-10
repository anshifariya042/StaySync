import Hostel from "../models/hostelModel";

export const createHostelService = async (data: any) => {
  const hostel = new Hostel(data);
  return await hostel.save();
};
