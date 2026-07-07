import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String },
    name: {
        type: String,
        required: [true, "Full name is required"]
    },
    employeeId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple nulls but ensures uniqueness for provided IDs
    },
    // department: {
    //     type: String,
    //     // Note: Ensured "logistics" is lowercase to match typical backend conventions
    //     enum: ["logistics & warehouse", "administration", "inventory control", "quality assurance staff"],
    //     lowercase: true
    // },
    role: {
        type: String,
        // FIX: Matches your frontend's lowercase values to pass validation
        enum: ["admin", "manager", "staff", "warehouse"],
        default: 'staff',
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, 
    },
    phone: {
        type: String, 
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    address: { type: String },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        lowercase: true
    },
    verification: { type: String }, // Can store doc path or verification status
    productivity: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    works: { type: String }, // Field for core assignments/notes
    img: { type: String },
    // Personal & Contact Details
    gender: { type: String, enum: ["male", "female", "not specified"] },
    language: { type: String, enum: ["English", "Hindi"] },
    secondaryEmail: { type: String },
    // Business & System Context
    businessName: { type: String },
    currency: { type: String, enum: ["INR"] },
    timezone: { type: String, enum: ["IST (UTC+5:30)"] },
    // System Config
    twoFactor: { type: Boolean },
    emailNotifications: { type: Boolean },
    lowStockAlerts: { type: Boolean },
    autoBackup: { type: Boolean },
    pushNotifications: { type: Boolean }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;