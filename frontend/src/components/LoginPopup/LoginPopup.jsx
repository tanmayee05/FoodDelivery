import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [resetMethod, setResetMethod] = useState(null);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetPasswordData, setResetPasswordData] = useState({
        email: "",
        phoneNumber: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showOTPInput, setShowOTPInput] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        confirmPassword: ""
    });

    const [otpData, setOtpData] = useState({
        otp: "",
        phoneNumber: ""
    });

    // Check for token in URL on component mount
    React.useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (token) {
            setIsForgotPassword(true);
            setShowResetPassword(true);
        }
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const onResetPasswordChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setResetPasswordData(data => ({ ...data, [name]: value }));
    };

    const handleMethodSelect = (method) => {
        setResetMethod(method);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            if (!formData.email || !formData.password) {
                toast.error("Please enter both email and password");
                return;
            }

            console.log("Login attempt with:", {
                email: formData.email,
                password: formData.password ? "****" : ""
            });

            const response = await axios.post(`${url}/api/user/login`, {
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.success) {
                // Store token
                const token = response.data.token;
                setToken(token);
                localStorage.setItem("token", token);

                // Set default headers for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Load user data and cart data
                try {
                    await loadCartData({ token });
                    // Force a page reload to ensure all data is properly loaded
                    window.location.reload();
                } catch (error) {
                    console.error("Error loading user data:", error);
                    toast.error("Error loading user data. Please refresh the page.");
                }
            } else {
                toast.error(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response?.status === 404) {
                toast.error("User does not exist");
            } else if (error.response?.status === 401) {
                toast.error("Invalid credentials");
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || "Please enter both email and password");
            } else {
                toast.error(error.response?.data?.message || "An unexpected error occurred");
            }
        }
    };
    
    const onForgotPassword = async (e) => {
        e.preventDefault();
        try {
            if (!resetMethod) {
                toast.error("Please select a reset method");
                return;
            }

            if (resetMethod === 'email' && !resetPasswordData.email) {
                toast.error("Please enter your email address");
                return;
            }

            if (resetMethod === 'phone' && !resetPasswordData.phoneNumber) {
                toast.error("Please enter your phone number");
                return;
            }

            // Format phone number to include country code if not present
            let formattedPhoneNumber = resetPasswordData.phoneNumber;
            if (resetMethod === 'phone' && formattedPhoneNumber) {
                // Remove any non-digit characters except +
                formattedPhoneNumber = formattedPhoneNumber.replace(/[^\d+]/g, '');
                if (!formattedPhoneNumber.startsWith('+')) {
                    formattedPhoneNumber = '+91' + formattedPhoneNumber;
                }
            }

            console.log("Forgot password request:", {
                resetMethod,
                email: resetMethod === 'email' ? resetPasswordData.email : undefined,
                phoneNumber: resetMethod === 'phone' ? formattedPhoneNumber : undefined
            });

            const response = await axios.post(`${url}/api/user/forgot-password`, {
                resetMethod,
                email: resetMethod === 'email' ? resetPasswordData.email : undefined,
                phoneNumber: resetMethod === 'phone' ? formattedPhoneNumber : undefined
            });
    
            if (response.data.success) {
                if (resetMethod === 'phone') {
                    setShowOTPInput(true);
                    setOtpData(prev => ({ ...prev, phoneNumber: formattedPhoneNumber }));
                    // In development mode, show the OTP
                    if (response.data.otp) {
                        console.log("Development mode - OTP:", response.data.otp);
                        toast.info(`Development mode - OTP: ${response.data.otp}`);
                    }
                    toast.success("OTP sent to your phone number");
                } else {
                    // In development mode, show the token
                    if (response.data.token) {
                        console.log("Development mode - Reset token:", response.data.token);
                        toast.info(`Development mode - Reset token: ${response.data.token}`);
                    }
                    toast.success("Reset link sent to your email");
                    setIsForgotPassword(false);
                    setCurrState("Login");
                }
            } else {
                toast.error(response.data.message || "Failed to send reset link");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            
            if (error.response?.data?.error) {
                toast.error(`Server error: ${error.response.data.error}`);
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 404) {
                toast.error("No account found with this email/phone number");
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || "Invalid request");
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
    };

    const onVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            if (!otpData.otp) {
                toast.error("Please enter the OTP");
                return;
            }

            console.log("Verifying OTP:", {
                phoneNumber: otpData.phoneNumber,
                otp: otpData.otp
            });

            const response = await axios.post(`${url}/api/user/verify-otp`, {
                phoneNumber: otpData.phoneNumber,
                otp: otpData.otp
            });

            if (response.data.success) {
                toast.success("OTP verified successfully");
                setShowOTPInput(false);
                setShowResetPassword(true);
            } else {
                toast.error(response.data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            if (error.response?.status === 400) {
                toast.error("Invalid or expired OTP");
            } else {
                toast.error(error.response?.data?.message || "Failed to verify OTP");
            }
        }
    };

    const onResetPassword = async (e) => {
        e.preventDefault();

        if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            // Get the token from the URL if it exists
            const token = new URLSearchParams(window.location.search).get('token');
            
            if (!token) {
                toast.error("Invalid reset link");
                return;
            }

            console.log("Resetting password with token:", token);

            const response = await axios.post(`${url}/api/user/reset-password/${token}`, {
                password: resetPasswordData.newPassword,
                confirmPassword: resetPasswordData.confirmPassword
            });

            if (response.data.success) {
                toast.success("Password reset successfully");
                setIsForgotPassword(false);
                setCurrState("Login");
                // Clear the URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error) {
            console.error("Reset password error:", error);
            if (error.response?.status === 400) {
                toast.error("Invalid or expired reset link. Please request a new one.");
            } else {
                toast.error(error.response?.data?.message || "Error resetting password");
            }
        }
    };

    const onRegister = async (e) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            // Format phone number to include country code if not present
            let formattedPhoneNumber = formData.phoneNumber;
            if (formattedPhoneNumber && !formattedPhoneNumber.startsWith('+')) {
                formattedPhoneNumber = '+91' + formattedPhoneNumber;
            }

            console.log("Registration data:", {
                name: formData.name,
                email: formData.email,
                phoneNumber: formattedPhoneNumber
            });

            const response = await axios.post(`${url}/api/user/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phoneNumber: formattedPhoneNumber
        });

        if (response.data.success) {
                toast.success("Registration successful");
                setShowLogin(false);
                setCurrState("Login");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phoneNumber: "",
                    confirmPassword: ""
                });
        } else {
                toast.error(response.data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={
                isForgotPassword 
                    ? (showOTPInput 
                        ? onVerifyOTP 
                        : (showResetPassword 
                            ? onResetPassword 
                            : onForgotPassword)) 
                    : (currState === "Login" ? onLogin : onRegister)
            } className="login-popup-container">
                <div className="login-popup-title">
                    <h2>
                        {isForgotPassword 
                            ? (showOTPInput 
                                ? "Verify OTP" 
                                : (showResetPassword 
                                    ? "Reset Password" 
                                    : "Forgot Password")) 
                            : currState}
                    </h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>

                {isForgotPassword ? (
                    showOTPInput ? (
                        <div className="otp-input-container">
                            <h3>Enter OTP</h3>
                            <p>OTP has been sent to {otpData.phoneNumber}</p>
                            <div className="form-group">
                            <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otpData.otp}
                                    onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                                required
                                    maxLength="6"
                            />
                            </div>
                        </div>
                    ) : showResetPassword ? (
                        <div className="login-popup-inputs">
                            <input
                                name="newPassword"
                                onChange={onResetPasswordChangeHandler}
                                value={resetPasswordData.newPassword}
                                type="password"
                                placeholder="Enter new password"
                                required
                            />
                            <input
                                name="confirmPassword"
                                onChange={onResetPasswordChangeHandler}
                                value={resetPasswordData.confirmPassword}
                                type="password"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            {!resetMethod ? (
                                <div className="reset-method-container">
                                    <h3>Select Reset Method</h3>
                                    <div className="reset-method-buttons">
                                        <button 
                                            type="button"
                                            className="reset-method-btn"
                                            onClick={() => handleMethodSelect('email')}
                                        >
                                            Reset via Email
                                        </button>
                                        <button 
                                            type="button"
                                            className="reset-method-btn"
                                            onClick={() => handleMethodSelect('phone')}
                                        >
                                            Reset via Phone
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="login-popup-inputs">
                                    {resetMethod === 'email' ? (
                                        <input
                                            name="email"
                                            onChange={onResetPasswordChangeHandler}
                                            value={resetPasswordData.email}
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    ) : (
                                        <div className="phone-input-container">
                                            <input
                                                name="phoneNumber"
                                                onChange={(e) => {
                                                    // Only allow numbers and + symbol
                                                    let value = e.target.value.replace(/[^0-9+]/g, '');
                                                    // Ensure only one + at the start
                                                    if (value.startsWith('+')) {
                                                        value = '+' + value.slice(1).replace(/\+/g, '');
                                                    }
                                                    // Limit to 15 characters (including country code)
                                                    value = value.slice(0, 15);
                                                    setResetPasswordData(prev => ({
                                                        ...prev,
                                                        phoneNumber: value
                                                    }));
                                                }}
                                                value={resetPasswordData.phoneNumber}
                                                type="tel"
                                                placeholder="Enter your phone number (e.g., +919876543210)"
                                                required
                                                pattern="[0-9+]*"
                                                maxLength="15"
                                            />
                                            <small className="phone-format-hint">Format: +91XXXXXXXXXX</small>
                                        </div>
                                    )}
                                    <button 
                                        type="button" 
                                        className="back-btn"
                                        onClick={() => setResetMethod(null)}
                                    >
                                        Back
                                    </button>
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <div className="login-popup-inputs">
                        {currState === "Sign Up" ? (
                            <input
                                name='name'
                                onChange={onChangeHandler}
                                value={formData.name}
                                type="text"
                                placeholder='Your name'
                                required
                            />
                        ) : null}
                        <input
                            name='email'
                            onChange={onChangeHandler}
                            value={formData.email}
                            type="email"
                            placeholder='Your email'
                            required
                        />
                        {currState === "Sign Up" && (
                            <div className="form-group">
                                <input
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="Enter your phone number (e.g., +919876543210)"
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        // Only allow numbers and + symbol
                                        let value = e.target.value.replace(/[^0-9+]/g, '');
                                        // Ensure only one + at the start
                                        if (value.startsWith('+')) {
                                            value = '+' + value.slice(1).replace(/\+/g, '');
                                        }
                                        // Limit to 15 characters (including country code)
                                        value = value.slice(0, 15);
                                        setFormData(prev => ({
                                            ...prev,
                                            phoneNumber: value
                                        }));
                                    }}
                                    required
                                    pattern="[0-9+]*"
                                    maxLength="15"
                                />
                                <small className="phone-format-hint">Format: +91XXXXXXXXXX</small>
                            </div>
                        )}
                        <input
                            name='password'
                            onChange={onChangeHandler}
                            value={formData.password}
                            type="password"
                            placeholder='Password'
                            required
                        />
                        {currState === "Sign Up" && (
                            <input
                                name='confirmPassword'
                                onChange={onChangeHandler}
                                value={formData.confirmPassword}
                                type="password"
                                placeholder='Confirm Password'
                                required
                            />
                        )}
                    </div>
                )}

                <button type="submit">
                    {isForgotPassword
                        ? (showOTPInput 
                            ? "Verify OTP" 
                            : (showResetPassword 
                                ? "Reset Password" 
                                : "Send Reset Link")) 
                        : (currState === "Login" ? "Login" : "Create Account")}
                </button>

                {!isForgotPassword ? (
                    <p>
                        {currState === "Login"
                            ? <>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></>
                            : <>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></>
                        }
                        <br />
                        <span onClick={() => { 
                            setIsForgotPassword(true); 
                            setCurrState("Forgot Password"); 
                            setResetMethod(null); 
                            setShowResetPassword(false);
                            setShowOTPInput(false);
                            setResetPasswordData({
                                email: "",
                                phoneNumber: "",
                                otp: "",
                                newPassword: "",
                                confirmPassword: ""
                            });
                        }}>Forgot Password?</span>
                    </p>
                ) : (
                    <p>
                        <span onClick={() => { 
                            setIsForgotPassword(false); 
                            setCurrState("Login"); 
                            setResetMethod(null); 
                            setShowOTPInput(false);
                            setShowResetPassword(false);
                            setResetPasswordData({
                                email: "",
                                phoneNumber: "",
                                otp: "",
                                newPassword: "",
                                confirmPassword: ""
                            });
                            window.history.replaceState({}, document.title, window.location.pathname);
                        }}>Back to Login</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;