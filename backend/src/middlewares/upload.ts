import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "hostels",
      resource_type: "image",
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({ storage });

export default upload;
