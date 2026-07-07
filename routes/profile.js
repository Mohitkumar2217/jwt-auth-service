import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import { Profile } from "../controllers/authController.js";

const router = express.Router();

router.get('/me', auth, Profile);

export default router;