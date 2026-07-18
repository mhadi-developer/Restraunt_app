import express from "express";
const router = express.Router();
import {registerUser , loginUser, getLoginUser} from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.user.js";



router.route('/user/register').post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/get/user/loggedIn").get(isAuthenticated, getLoginUser);









export default router;