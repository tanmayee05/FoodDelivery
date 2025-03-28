import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

// Create Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }        

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

        user.resetToken = token;
        user.tokenExpiry = Date.now() + 600000; // 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,  // ✅ Use 587 instead of 465
            secure: false, // ✅ Must be false for TLS
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.EMAIL_PASSWORD 
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        

        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Reset Password",
            html: `<p>Click the following link to reset your password:</p>
                   <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>
                   <p>This link will expire in 10 minutes.</p>`
        };

        transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP Connection Error:", error);
                return res.status(500).json({ success: false, message: "SMTP connection failed" });
            } else {
                console.log("SMTP Connected Successfully");
            }
        });
        

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Email Sending Error:", err);
                if (!res.headersSent) {
                    return res.status(500).json({ success: false, message: "Failed to send email" });
                }
            } else {
                console.log("Email Sent:", info.response);
                if (!res.headersSent) {
                    return res.json({ success: true, message: "Email sent" });
                }
            }
        });
        
        
        
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await userModel.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();

        res.json({ message: "Password has been reset" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password" });
    }
};

export { loginUser, registerUser, forgotPassword, resetPassword };
