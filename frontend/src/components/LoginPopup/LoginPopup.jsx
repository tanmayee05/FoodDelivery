import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login"); // Default to "Login"
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State for forgot password
    const [resetPasswordData, setResetPasswordData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onResetPasswordChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setResetPasswordData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        } else {
            new_url += "/api/user/register";
        }

        const response = await axios.post(new_url, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            loadCartData({ token: response.data.token });
            setShowLogin(false);
        } else {
            toast.error(response.data.message);
        }
    };

    const onForgotPassword = async (e) => {
        e.preventDefault();

        // Send a request to the backend to initiate password reset
        const response = await axios.post(`${url}/api/user/forgot-password`, {
            email: resetPasswordData.email
        });

        if (response.data.success) {
            toast.success("Password reset link sent to your email.");
            setIsForgotPassword(false); // Reset the state
        } else {
            toast.error(response.data.message);
        }
    };

    const onResetPassword = async (e) => {
        e.preventDefault();

        if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        // Send a request to the backend to reset the password
        const response = await axios.post(`${url}/api/user/reset-password`, {
            email: resetPasswordData.email,
            newPassword: resetPasswordData.newPassword
        });

        if (response.data.success) {
            toast.success("Password reset successfully.");
            setIsForgotPassword(false); // Reset the state
            setCurrState("Login"); // Switch back to login
        } else {
            toast.error(response.data.message);
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={isForgotPassword ? (currState === "Forgot Password" ? onForgotPassword : onResetPassword) : onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{isForgotPassword ? (currState === "Forgot Password" ? "Forgot Password" : "Reset Password") : currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>

                {isForgotPassword ? (
                    currState === "Forgot Password" ? (
                        <div className="login-popup-inputs">
                            <input
                                name='email'
                                onChange={onResetPasswordChangeHandler}
                                value={resetPasswordData.email}
                                type="email"
                                placeholder='Your email'
                                required
                            />
                        </div>
                    ) : (
                        <div className="login-popup-inputs">
                            <input
                                name='newPassword'
                                onChange={onResetPasswordChangeHandler}
                                value={resetPasswordData.newPassword}
                                type="password"
                                placeholder='New Password'
                                required
                            />
                            <input
                                name='confirmPassword'
                                onChange={onResetPasswordChangeHandler}
                                value={resetPasswordData.confirmPassword}
                                type="password"
                                placeholder='Confirm New Password'
                                required
                            />
                        </div>
                    )
                ) : (
                    <div className="login-popup-inputs">
                        {currState === "Sign Up" ? (
                            <input
                                name='name'
                                onChange={onChangeHandler}
                                value={data.name}
                                type="text"
                                placeholder='Your name'
                                required
                            />
                        ) : null}
                        <input
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder='Your email'
                            required
                        />
                        <input
                            name='password'
                            onChange={onChangeHandler}
                            value={data.password}
                            type="password"
                            placeholder='Password'
                            required
                        />
                    </div>
                )}

                {!isForgotPassword && (
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                )}

                <button type="submit">
                    {isForgotPassword
                        ? (currState === "Forgot Password" ? "Send Reset Link" : "Reset Password")
                        : (currState === "Login" ? "Login" : "Create Account")
                    }
                </button>

                {!isForgotPassword ? (
                    <p>
                        {currState === "Login"
                            ? <>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></>
                            : <>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></>
                        }
                        <br />
                        <span onClick={() => { setIsForgotPassword(true); setCurrState("Forgot Password"); }}>Forgot Password?</span>
                    </p>
                ) : (
                    <p>
                        <span onClick={() => { setIsForgotPassword(false); setCurrState("Login"); }}>Back to Login</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;