import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import './ResetPassword.css'; // We'll create this CSS file next

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:4000/api/user/reset-password/${token}`,
                {
                    password,
                    confirmPassword
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success("Password reset successfully");
                navigate('/login');
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error(error.response?.data?.message || "Error resetting password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <h2>Reset Password</h2>
                    <p className="subtitle">Enter your new password below</p>
                </div>
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="input-group">
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="8"
                                disabled={isLoading}
                            />
                        </div>
                        <small className="password-hint">
                            Password must be at least 8 characters long
                        </small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-group">
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength="8"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className={`reset-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
