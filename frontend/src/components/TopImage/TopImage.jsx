import React, { useContext } from 'react';
import './TopImage.css';
import { StoreContext } from '../../Context/StoreContext';

const TopImage = ({ setShowLogin }) => {
  const { token } = useContext(StoreContext);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLogin(true);
  };

  const handleViewMenuClick = (e) => {
    e.preventDefault();
    const exploreMenuSection = document.getElementById('explore-menu');
    if (exploreMenuSection) {
      exploreMenuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top-image" className="top-image-container">
      <div className="overlay-text">
        <h1>Explore our menu to get your favourite item</h1>
        {!token ? (
          <p>To place an order, please login first.</p>
        ) : (
          <h2>Welcome back! Start your order now 🍽️</h2>
        )}
        <div className="top-image-buttons">
          <button onClick={handleViewMenuClick}>View Menu</button>
          {!token && <button onClick={handleLoginClick}>Login</button>}
        </div>
      </div>
      <div className="image-layout">
        <div className="left-column">
          <img
            src="https://i.pinimg.com/736x/7b/3f/79/7b3f793f75f985937b4eb8556a1ece54.jpg"
            alt="Menu 1"
            className="side-image"
          />
        </div>
      </div>
    </div>
  );
};

export default TopImage;