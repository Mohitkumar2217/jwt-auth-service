import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import RefreshToken from "../models/RefreshToken.js";

dotenv.config();

const ACCESS_TTL = process.env.ACCESS_TTL || "15m";
const REFRESH_TTL = process.env.REFRESH_TTL || "7d";
const REFRESH_TTL_SEC = Number(process.env.REFRESH_TTL_SEC || 604800);

export function hashToken(token) {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}

export function createJti() {
    return crypto.randomBytes(16).toString("hex");
}

export function signAccessToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: ACCESS_TTL,
        }
    );
}

export function signRefreshToken(user, jti) {
    return jwt.sign(
        {
            id: user._id.toString(),
            jti,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TTL,
        }
    );
}

export async function persistRefreshToken({
    user,
    refreshToken,
    jti,
    ip,
    userAgent,
}) {
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(
        Date.now() + REFRESH_TTL_SEC * 1000
    );

    await RefreshToken.create({
        user: user._id,
        tokenHash,
        jti,
        expiresAt,
        ip,
        userAgent,
    });
}

export function setRefreshCookies(res, refreshToken) {
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: REFRESH_TTL_SEC * 1000,
    });
}

export async function rotateRefreshToken(
    oldDoc,
    user,
    req,
    res
) {
    oldDoc.revokedAt = new Date();
    const newJti = createJti();
    oldDoc.replacedBy = newJti;

    await oldDoc.save();
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(
        user,
        newJti
    );

    await persistRefreshToken({
        user,
        refreshToken,
        jti: newJti,
        ip: req.ip,
        userAgent: req.headers["user-agent"] || "",
    });

    setRefreshCookies(res, refreshToken);

    return {
        accessToken,
        refreshToken,
    };
}