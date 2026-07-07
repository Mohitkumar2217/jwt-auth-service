import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const [scheme, tokenFromHeader] = authHeader.split(" ");

    const tokenFromCookie = req.cookies?.access_token;

    const token =
        scheme === "Bearer" && tokenFromHeader
            ? tokenFromHeader
            : tokenFromCookie;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token missing",
        });
    }

    try {
        const blacklisted = await BlacklistToken.findOne({
            token,
        });

        if (blacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token revoked. Please login again.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token expired",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

export default auth;