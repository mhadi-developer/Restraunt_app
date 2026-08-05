import express from "express";
const router = express.Router();
import {
  verifyWebhook,
  receiveWebhook,
} from "../controllers/whatsapp.webhook.controller.js";



router.route("/get/whatsapp/webhook").get(verifyWebhook);
router.route("/post/whatsapp/webhook").post(receiveWebhook);



export default router;