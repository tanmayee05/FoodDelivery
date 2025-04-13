import express from 'express';
import { loginUser, registerUser, forgotPassword, resetPassword, verifyOTP } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/reset-password/:token', resetPassword);

export default userRouter;