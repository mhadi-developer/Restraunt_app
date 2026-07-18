import express from "express"
const router = express.Router();
import { loginAdmin } from "../controllers/admin.controller.js";



router.route('/admin/login').post(loginAdmin);


export default router;