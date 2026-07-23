import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "restraunt_app_categories",
      // FIX: Must be camelCase
      allowedFormats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

export const uploadCategoryImg = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
