import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      {/* About Us Section */}
      <div className="footer-section about-us">
        <h2>About Us</h2>
        <ul>
          <li>🚀 <b>Faster Delivery</b> - Get your food delivered within minutes.</li>
          <li>🧼 <b>Hygienic Preparation</b> - We follow strict hygiene standards.</li>
          <li>🍏 <b>Fresh Ingredients</b> - Only the best and freshest items used.</li>
        </ul>
      </div>

      {/* Contact Details Section */}
      <div className="footer-section contact-details">
        <h2>Contact Us</h2>
        <p>📞 <b>Phone:</b> +1 234 567 890</p>
        <p>📧 <b>Email:</b> support@example.com</p>
      </div>
    </div>
  );
};

export default Footer;
