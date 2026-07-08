import express from "express";
import { Router } from "express";
import { Login, Register, Logout, RefreshTokenControl } from "../controllers/authController.js";
import authorize from "../middleware/authorize.js";

const router =  express.Router()

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/refresh", RefreshTokenControl);

export default router;