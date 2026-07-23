import express from "express";
const router = express.Router();
import {
  getLoginAdmin,
  loginAdmin,
  createCategory,
  createMenuItem,
} from "../controllers/admin.controller.js";
import { getCategories } from "../controllers/common.controller.js";
import { isAdminAuthenticated } from "../middleware/isAuthenticated.admin.js";
import { uploadCategoryImg } from "../middleware/uplaod.js";
import { uploadMenuImages } from "../middleware/uploadMenuItem.js";

router.route("/admin/login").post(loginAdmin);
router.route("/get/admin").get(isAdminAuthenticated, getLoginAdmin);
router.post(
  "/admin/create/category",
  (req, res, next) => {
    uploadCategoryImg.single("image")(req, res, (error) => {
      if (error) {
        console.error("🚨 CLOUDINARY UPLOAD FAILED:", error);
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
          error: error.message,
        });
      }
      next(); // If upload succeeds, proceed to createCategory
    });
  },
  createCategory,
);
router.route("/admin/get/categories").get(getCategories);

router.route("/admin/create/item").post( uploadMenuImages.array("images") ,createMenuItem)
export default router;
