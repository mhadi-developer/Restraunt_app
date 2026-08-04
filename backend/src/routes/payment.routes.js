import express from "express";
import {
  checkoutOrderSaved,
  getOrder,
} from "../controllers/payment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.user.js";

const router = express.Router();

router.route("/checkout/order").post(isAuthenticated, checkoutOrderSaved);
router.route("/get/order/:id").get(isAuthenticated, getOrder);

export default router;
