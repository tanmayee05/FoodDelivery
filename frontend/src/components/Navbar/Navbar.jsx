import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { StoreContext } from '../../Context/StoreContext';
import { BiSearch } from 'react-icons/bi';
import { MdShoppingCart } from 'react-icons/md';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { AiOutlineShopping } from 'react-icons/ai';

const Navbar = ({ setShowLogin, setSearchQuery }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  //muorders
  const goToOrders = () => {
    navigate('/myorders');
  };

  // Handle menu click
  const handleMenuClick = () => {
    setMenu("menu");
    navigate('/'); // Navigate to the home page
    setTimeout(() => {
      const exploreMenuSection = document.getElementById('explore-menu');
      if (exploreMenuSection) {
        exploreMenuSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to ExploreMenu
      }
    }, 100); // Small delay to ensure the page has loaded
  };

  // Check if the current route is the cart page
  const isCartPage = location.pathname === '/cart';

  return (
    <div className='navbar'>
      <Link to='/'><h2 className="logo">FoodApp</h2></Link>
      <ul className="navbar-menu">
        <Link 
          to="/" 
          onClick={() => setMenu("home")} 
          className={`${menu === "home" && !isCartPage ? "active" : ""}`}
        >
          home
        </Link>
        <span 
          onClick={handleMenuClick} 
          className={`${menu === "menu" && !isCartPage ? "active" : ""}`}
        >
          menu
        </span>
        <a 
          href='#footer' 
          onClick={() => setMenu("contact")} 
          className={`${menu === "contact" && !isCartPage ? "active" : ""}`}
        >
          contact us
        </a>
      </ul>
      <div className="navbar-right">
        {/* Search Bar */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search food items..." 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <BiSearch className="navbar-icon" />
        </div>

        <Link to='/cart' className='navbar-search-icon'>
          <MdShoppingCart className="navbar-icon" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className='navbar-profile'>
            <FiUser className="navbar-icon" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={goToOrders}> <AiOutlineShopping /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <FiLogOut /> <p>Logout</p></li> 
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;