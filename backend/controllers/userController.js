import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import twilio from "twilio"; // Import the Twilio library

// Initialize Twilio client
let twilioClient = null;
try {
    // Remove quotes from credentials if present
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.replace(/"/g, '').trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.replace(/"/g, '').trim();
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER?.replace(/"/g, '').trim();

    console.log("Twilio Configuration:");
    console.log("- Account SID:", accountSid ? `${accountSid.substring(0, 10)}...` : "Missing");
    console.log("- Auth Token:", authToken ? `${authToken.substring(0, 5)}...` : "Missing");
    console.log("- Phone Number:", phoneNumber || "Missing");

    if (!accountSid || !authToken || !phoneNumber) {
        console.error("Missing Twilio credentials. SMS functionality will be disabled.");
    } else {
        twilioClient = twilio(accountSid, authToken);
        console.log("Twilio client initialized successfully");
        
        // Test the credentials
        twilioClient.api.accounts(accountSid).fetch()
            .then(account => {
                console.log("✓ Twilio account verified:", account.friendlyName);
                console.log("✓ Account status:", account.status);
            })
            .catch(error => {
                console.error("✗ Error verifying Twilio account:", error.message);
                twilioClient = null;
            });
    }
} catch (error) {
    console.error("Error initializing Twilio client:", error.message);
    twilioClient = null;
}

// Create Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                cartData: user.cartData || {}
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
    try {
        // Check if user exists with either email or phone number
        const exists = await userModel.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User with this email or phone number already exists"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate phone number (basic validation)
        if (!phoneNumber || phoneNumber.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with empty cart
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            cartData: {} // Initialize empty cart
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                cartData: user.cartData || {}
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email, phoneNumber, resetMethod } = req.body;
    try {
        console.log("Received forgot password request:", { email, phoneNumber, resetMethod });

        if (!resetMethod) {
            return res.status(400).json({ success: false, message: "Reset method is required" });
        }

        let user;
        if (resetMethod === 'email') {
            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }
            user = await userModel.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(404).json({ success: false, message: "No account found with this email" });
            }
        } else if (resetMethod === 'phone') {
            if (!phoneNumber) {
                return res.status(400).json({ success: false, message: "Phone number is required" });
            }

            // Format phone number to include country code if not present
            let formattedPhoneNumber = phoneNumber;
            if (!formattedPhoneNumber.startsWith('+')) {
                formattedPhoneNumber = '+91' + formattedPhoneNumber;
            }

            // Find user by phone number
            user = await userModel.findOne({ phoneNumber: formattedPhoneNumber });
        if (!user) {
                return res.status(404).json({ success: false, message: "No account found with this phone number" });
            }
        } else {
            return res.status(400).json({ success: false, message: "Invalid reset method" });
        }        

        // Generate and save OTP or token based on reset method
        if (resetMethod === 'email') {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
        user.resetToken = token;
        user.tokenExpiry = Date.now() + 600000; // 10 minutes
        await user.save();

            // In development mode, return the token directly
            if (process.env.NODE_ENV === 'development') {
                console.log("**** DEVELOPMENT MODE: Reset Password Link ****");
                console.log(`**** Reset link: http://localhost:5173/reset-password/${token} ****`);
                
                return res.json({ 
                    success: true, 
                    message: "Reset link generated (development mode)",
                    token,
                    resetLink: `http://localhost:5173/reset-password/${token}`
                });
            }

            try {
                // Email credentials
                const emailUser = process.env.EMAIL ? process.env.EMAIL.trim() : '';
                const emailPass = process.env.PASSWORD_APP_EMAIL ? process.env.PASSWORD_APP_EMAIL.trim() : '';
                
                if (!emailUser || !emailPass) {
                    console.error("Missing email credentials:");
                    console.error("- Email:", emailUser ? "Present" : "Missing");
                    console.error("- Password:", emailPass ? "Present" : "Missing");
                    
                    return res.status(500).json({
                        success: false,
                        message: "Email service is not configured. Please contact support."
                    });
                }

                console.log("Email Configuration:");
                console.log("- Email:", emailUser);
                console.log("- Using Gmail service for sending emails");

                // Use Gmail service configuration
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: emailUser,
                        pass: emailPass
                    }
                });

        const mailOptions = {
                    from: `"Food Delivery" <${emailUser}>`,
                    to: email,
            subject: "Reset Password",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Password Reset Request</h2>
                            <p>You have requested to reset your password. Click the button below to proceed:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:5173/reset-password/${token}" 
                                   style="background-color: #f26f17; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                                     Reset Password
                                </a>
                            </div>
                            <p style="color: #666; font-size: 14px;">This link will expire in 10 minutes.</p>
                            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                        </div>
                    `
                };

                console.log("Attempting to send email to:", email);
                const info = await transporter.sendMail(mailOptions);
                console.log("Email sent successfully. Message ID:", info.messageId);
                
                return res.json({ 
                    success: true, 
                    message: "Reset link sent to your email" 
                });
            } catch (emailError) {
                console.error("Email sending error:", emailError);
                
                // In development mode, still return the token if email fails
                if (process.env.NODE_ENV === 'development') {
                    return res.json({
                        success: true,
                        message: "Development mode - Reset link generated (email failed)",
                        token,
                        resetLink: `http://localhost:5173/reset-password/${token}`,
                        error: emailError.message
                    });
                }
                
                return res.status(500).json({
                    success: false,
                    message: "Failed to send email. Please try again or use phone method.",
                    error: emailError.message
                });
            }
            } else {
            // Phone reset method
            const otp = generateOTP();
            user.resetOTP = otp;
            user.otpExpiry = Date.now() + 300000; // 5 minutes
            await user.save();

            // Always show OTP in development mode for testing
            console.log(`**** OTP for ${phoneNumber}: ${otp} ****`);
            
            if (process.env.NODE_ENV === 'development') {
                console.log("**** DEVELOPMENT MODE: Using development OTP flow ****");
                
                return res.json({
                    success: true,
                    message: "Development mode - OTP generated for testing",
                    otp,
                    phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, '*')
                });
            }

            if (!twilioClient) {
                return res.status(500).json({
                    success: false,
                    message: "SMS service is not configured properly. Please try email method or contact support."
                });
            }

            // Format phone number for Twilio
            let formattedPhoneNumber = phoneNumber;
            if (!formattedPhoneNumber.startsWith('+')) {
                formattedPhoneNumber = '+91' + formattedPhoneNumber.replace(/^0+/, '');
            }

            console.log("Sending SMS with following details:");
            console.log("From:", process.env.TWILIO_PHONE_NUMBER);
            console.log("To:", formattedPhoneNumber);

            try {
                const message = await twilioClient.messages.create({
                    body: `Your Food Delivery OTP for password reset is: ${otp}. Valid for 5 minutes.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: formattedPhoneNumber
                });

                console.log("SMS sent successfully. Message SID:", message.sid);

                return res.json({
                    success: true,
                    message: "OTP sent to your phone number",
                    phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, '*')
                });
            } catch (smsError) {
                console.error("Twilio SMS error:", smsError.message);
                
                // If in development mode and we somehow got here despite the early return above
                if (process.env.NODE_ENV === 'development') {
                    return res.json({
                        success: true,
                        message: "Development mode - OTP generated despite SMS error",
                        otp,
                        phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, '*'),
                        error: smsError.message
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: `Failed to send OTP: ${smsError.message}. Please try email method or contact support.`,
                    error: smsError.message
                });
            }
        }
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;
    try {
        const user = await userModel.findOne({
            phoneNumber,
            resetOTP: otp,
            otpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
        user.resetToken = token;
        user.tokenExpiry = Date.now() + 600000;
        user.resetOTP = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying OTP" });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    try {
        if (!password || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide both password and confirm password" 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Passwords do not match" 
            });
        }

        if (password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 8 characters long" 
            });
        }

        const user = await userModel.findOne({
            resetToken: token,
            tokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired reset link. Please request a new one." 
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();

        res.json({ 
            success: true, 
            message: "Password has been reset successfully" 
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error resetting password",
            error: error.message 
        });
    }
};

export { loginUser, registerUser, forgotPassword, resetPassword, verifyOTP };