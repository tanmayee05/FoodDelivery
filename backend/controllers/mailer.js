// utils/mailer.js
import nodemailer from 'nodemailer';

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

// Function to send a password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`; // Replace with your frontend URL

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // Recipient address
        subject: 'Password Reset Request', // Email subject
        html: `
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `, // Email body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email.');
    }
};