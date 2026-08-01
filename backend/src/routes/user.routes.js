import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getLoginUser,
  saveOrderSummary,
  getOrderSummary,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.user.js";
import {
  getCategories,
  getMenuItems,
  getMenuItemById,
} from "../controllers/common.controller.js";




router.route('/user/register').post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/get/user/loggedIn").get(isAuthenticated, getLoginUser);
router.route("/get/categories").get(getCategories);
router.route("/get/items").get(getMenuItems);
router.route("/get/item/:id").get(getMenuItemById);
router.route("/cart/order/summary").post(isAuthenticated, saveOrderSummary);
router.route("/get/order/summary").get(isAuthenticated, getOrderSummary );












export default router;