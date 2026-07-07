import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0, // MongoDB TTL Index
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("BlacklistToken", blacklistTokenSchema);