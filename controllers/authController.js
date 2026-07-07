import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import BlacklistToken from "../models/BlacklistToken.js";

// Login
export const Login = async (req, res) => {
    try {
        // email password check
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide email and password"
            })
        }

        // search email in db
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({
            success: false,
            message: "Invalid email"
        })

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({
            success: false,
            message: "Invalid password"
        })

        // create token 
        const token = jwt.sign({ 
            id: user._id, 
            role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        // setup cookies
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}`,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed"
        })
    }
};


export const Register = async (req, res) => {
    try {
        // fetch form data 
        const { name, email, password, address, role } = req.body;

        // check is already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({
            success: false,
            message: "Email already exists"
        });

        // generate salt fo hashing
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // store data with hashed password
        const newUser = new User({ name, email, password: hashedPassword, address, role: role || 'staff' });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Registered successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
    }
}

export const Profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.json({ user });
    } catch (err) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
} 

export const Logout = async (req, res) => {
    try {

        const token = req.cookies.access_token;

        if (token) {

            const decoded = jwt.decode(token);

            await BlacklistToken.create({
                token,
                expiresAt: new Date(decoded.exp * 1000),
            });
        }

        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};