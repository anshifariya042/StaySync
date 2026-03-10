import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "hostels",
      format: "png", // optional
      public_id: file.originalname,
    };
  },
});

const upload = multer({ storage });

export default upload;
