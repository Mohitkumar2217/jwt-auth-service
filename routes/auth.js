import express from "express";
import { Router } from "express";
import { Login, Register, Logout } from "../controllers/authController.js";
import authorize from "../middleware/authorize.js";

const router =  express.Router()

router.post("/register", authorize("admin", "staff", "manager", "warehouse"), Register);
router.post("/login", authorize("admin", "staff", "manager", "warehouse"), Login);
router.post("/logout", authorize("admin", "staff", "manager", "warehouse"), Logout);

export default router;