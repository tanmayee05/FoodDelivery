import React from 'react';
import './ContactUs.css';

const ContactUs = () => {
    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you! Whether you have a question, feedback, or need assistance, feel free to reach out to us.</p>

            <img
                src="https://i.pinimg.com/474x/c4/3e/d8/c43ed885734d3c096da487320dc15694.jpg"
                alt="Contact Banner"
                className="contact-image"
            />

            <div className="contact-methods">
                <div className="contact-item">
                    <h3>Email Us</h3>
                    <p>abcd@gmail.com</p>
                </div>

                <div className="contact-item">
                    <h3>Call Us</h3>
                    <p>+1 (123) 456-7890</p>
                </div>

                <div className="contact-item">
                    <h3>Visit Us</h3>
                    <p>123 Food Street, Delicious City, Yummyland</p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
