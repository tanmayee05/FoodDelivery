import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [resetMethod, setResetMethod] = useState(null);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleMethodSelect = (method) => {
        setResetMethod(method);
        setEmail('');
        setPhoneNumber('');
    };

    const formatPhoneNumber = (phone) => {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // If it starts with 0, remove it
        if (cleaned.startsWith('0')) {
            return cleaned.substring(1);
        }
        // If it doesn't start with country code, add India's code
        if (!cleaned.startsWith('91') && cleaned.length === 10) {
            return `91${cleaned}`;
        }
        return cleaned;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (!resetMethod) {
                toast.error("Please select a reset method");
                return;
            }

            const payload = {
                resetMethod,
                [resetMethod === 'email' ? 'email' : 'phoneNumber']: 
                    resetMethod === 'email' ? email : `+${formatPhoneNumber(phoneNumber)}`
            };

            const response = await axios.post(
                'http://localhost:4000/api/user/forgot-password', 
                payload,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                if (resetMethod === 'phone') {
                    setShowOTPInput(true);
                    toast.success("OTP sent to your phone number");
                } else {
                    toast.success("Reset link sent to your email");
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            const errorMessage = error.response?.data?.message || 
                              error.response?.data?.error || 
                              "An error occurred while processing your request";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await axios.post(
                'http://localhost:4000/api/user/verify-otp', 
                {
                    phoneNumber: `+${formatPhoneNumber(phoneNumber)}`,
                    otp
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                navigate(`/reset-password/${response.data.token}`);
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h4>Forgot Password</h4>
                {!resetMethod ? (
                    <div className="d-flex flex-column gap-3">
                        <button 
                            className="btn btn-primary" 
                            onClick={() => handleMethodSelect('email')}
                            disabled={isLoading}
                        >
                            Reset via Email
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => handleMethodSelect('phone')}
                            disabled={isLoading}
                        >
                            Reset via Phone
                        </button>
                    </div>
                ) : showOTPInput ? (
                    <form onSubmit={handleOTPSubmit}>
                        <div className="mb-3">
                            <label htmlFor="otp">
                                <strong>Enter OTP</strong>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="form-control rounded-0"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-success w-100 rounded-0"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor={resetMethod}>
                                <strong>{resetMethod === 'email' ? 'Email' : 'Phone Number'}</strong>
                            </label>
                            <input
                                type={resetMethod === 'email' ? 'email' : 'tel'}
                                placeholder={`Enter ${resetMethod === 'email' ? 'Email' : 'Phone Number'}`}
                                className="form-control rounded-0"
                                value={resetMethod === 'email' ? email : phoneNumber}
                                onChange={(e) => resetMethod === 'email' 
                                    ? setEmail(e.target.value) 
                                    : setPhoneNumber(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-success w-100 rounded-0"
                            disabled={isLoading}
                        >
                            {isLoading 
                                ? 'Processing...' 
                                : `Send ${resetMethod === 'email' ? 'Reset Link' : 'OTP'}`}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary w-100 rounded-0 mt-2"
                            onClick={() => {
                                setResetMethod(null);
                                setShowOTPInput(false);
                            }}
                            disabled={isLoading}
                        >
                            Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;