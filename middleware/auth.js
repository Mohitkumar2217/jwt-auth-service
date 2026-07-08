import jwt from "jsonwebtoken";
import BlacklistToken from '../models/BlackListToken.js'

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }

        const token = authHeader.split(" ")[1];
        const blacklisted = await BlacklistToken.findOne({
            token,
        });

        if (blacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token has been revoked. Please login again.",
            });
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token missing",
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();

    } catch (error) {
        console.error(error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
};

export default auth;