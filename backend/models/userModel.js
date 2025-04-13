import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    resetToken: String,
    tokenExpiry: Number,
    resetOTP: String,
    otpExpiry: Number,
    cartData: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
