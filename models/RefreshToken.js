import mongoose, { mongo } from "mongoose";
import User from "./User.js";

const refreshTokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    tokenHash: { type: String, required: true, unique: true },
    jti: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedBy: { type: Date, default: null },
    replacedBy: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    ip: String,
    userAgent: String,
});

export default mongoose.model('RefreshToken', refreshTokenSchema);