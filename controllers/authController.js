import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

import {
    createJti,
    signAccessToken,
    signRefreshToken,
    persistRefreshToken,
    setRefreshCookies,
    hashToken,
    rotateRefreshToken,
} from "../utils/tokens.js";

//LOGIN 
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const accessToken = signAccessToken(user);

        const jti = createJti();

        const refreshToken = signRefreshToken(user, jti);

        await persistRefreshToken({
            user,
            refreshToken,
            jti,
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });

        setRefreshCookies(res, refreshToken);

        return res.status(200).json({
            success: true,
            message: `Welcome ${user.name}`,

            accessToken,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

// REGISTER 
export const Register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            role,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role: role || "staff",
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Registration failed",
        });
    }
};

// PROFILE
export const Profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
};

// LOGOUT
export const Logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;
        if (refreshToken) {
            const tokenHash = hashToken(refreshToken);
            const storedToken = await RefreshToken.findOne({
                tokenHash,
            });

            if (storedToken && !storedToken.revokedAt) {
                storedToken.revokedAt = new Date();
                await storedToken.save();
            }
        }

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

// REFRESH ACCESS TOKEN 
export const RefreshTokenControl = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        const tokenHash = hashToken(refreshToken);

        const storedToken = await RefreshToken.findOne({
            tokenHash,
            jti: decoded.jti,
        }).populate({
            path: "user",
            select: "-password",
        });

        if (!storedToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not recognized",
            });
        }

        if (storedToken.revokedAt) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked",
            });
        }

        if (storedToken.expiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has expired",
            });
        }

        const result = await rotateRefreshToken(
            storedToken,
            storedToken.user,
            req,
            res
        );

        return res.status(200).json({
            success: true,
            accessToken: result.accessToken,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to refresh access token",
        });
    }
};