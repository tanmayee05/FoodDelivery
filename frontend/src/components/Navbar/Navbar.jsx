import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { BiSearch } from 'react-icons/bi';
import { MdShoppingCart } from 'react-icons/md';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { AiOutlineShopping } from 'react-icons/ai';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, setToken, searchFood } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    const goToOrders = () => {
        navigate('/myorders');
    };

    // In Navbar.js
const handleMenuClick = () => {
  setMenu("menu");
  clearSearch(); // Clear the search when menu is clicked
  navigate('/');
  setTimeout(() => {
    const exploreMenuSection = document.getElementById('explore-menu');
    if (exploreMenuSection) {
      exploreMenuSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchFood(query);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchFood(searchQuery);
        navigate('/');
    };

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
                <form className="search-bar" onSubmit={handleSearchSubmit}>
                    <input 
                        type="text" 
                        placeholder="Search food items..." 
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button type="submit" className="search-button">
                        <BiSearch className="navbar-icon" />
                    </button>
                </form>

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