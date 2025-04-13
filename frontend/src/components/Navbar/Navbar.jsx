import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { BiSearch } from 'react-icons/bi';
import { MdShoppingCart } from 'react-icons/md';  
import { FiUser, FiLogOut } from 'react-icons/fi';
import { AiOutlineShopping } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const [hamburgerMenu, setHamburgerMenu] = useState(false);
    const { getTotalCartAmount, token, setToken, searchFood } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollToSection, setScrollToSection] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        navigate('/');
    };

    const goToOrders = () => navigate('/myorders');

    const scrollToTopImage = () => {
        const section = document.getElementById('top-image');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    const handleHomeClick = () => {
        setMenu('home');
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(scrollToTopImage, 100);
        } else {
            scrollToTopImage();
        }
        setHamburgerMenu(false);
    };

    const handleMenuClick = () => {
        setMenu('menu');
        setScrollToSection('explore-menu');
        navigate('/');
        setHamburgerMenu(false);
    };

    const handleAboutUsClick = () => {
        setMenu('about');
        setScrollToSection('about-us-section');
        navigate('/');
        setHamburgerMenu(false);
    };

    const handleContactUsClick = () => {
        setMenu('contact');
        setScrollToSection('contact-us-section');
        navigate('/');
        setHamburgerMenu(false);
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        searchFood(val);
        navigateAndScrollToFoodDisplay();
    };

    const navigateAndScrollToFoodDisplay = () => {
        if (location.pathname !== '/') navigate('/');
        setTimeout(() => {
            const section = document.getElementById('food-display');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchFood(searchQuery);
        setScrollToSection('food-display');
        navigate('/');
    };

    useEffect(() => {
        if (scrollToSection) {
            const section = document.getElementById(scrollToSection);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            setScrollToSection(null);
        }
    }, [location.pathname, scrollToSection]);

    return (
        <div className="navbar">
            <Link to="/" className="logo">FoodApp</Link>

            {isMobileView ? (
                <>
                    <FaBars className="hamburger-icon" onClick={() => setHamburgerMenu(!hamburgerMenu)} />
                    <div className={`mobile-menu ${hamburgerMenu ? 'active' : ''}`}>
                        <ul>
                            <li onClick={handleHomeClick}>Home</li>
                            <li onClick={handleMenuClick}>Menu</li>
                            <li onClick={handleAboutUsClick}>About Us</li>
                            <li onClick={handleContactUsClick}>Contact Us</li>
                        </ul>
                    </div>
                </>
            ) : (
                <ul className="navbar-menu">
                    <li onClick={handleHomeClick} className={menu === 'home' ? 'active' : ''}>home</li>
                    <li onClick={handleMenuClick} className={menu === 'menu' ? 'active' : ''}>menu</li>
                    <li onClick={handleAboutUsClick} className={menu === 'about' ? 'active' : ''}>about us</li>
                    <li onClick={handleContactUsClick} className={menu === 'contact' ? 'active' : ''}>contact us</li>
                </ul>
            )}

            <div className="navbar-right">
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

                <Link to="/cart" className="navbar-search-icon">
                    <div className="icon-wrapper">
                        <MdShoppingCart className="navbar-icon" />
                        {getTotalCartAmount() > 0 && <div className="dot"></div>}
                    </div>
                </Link>

                {!token ? (
                    <button onClick={() => setShowLogin(true)}>login</button>
                ) : (
                    <div className="navbar-profile">
                        <FiUser className="navbar-icon" />
                        <ul className="navbar-profile-dropdown">
                            <li onClick={goToOrders}>
                                <AiOutlineShopping /> <p>Orders</p>
                            </li>
                            <hr />
                            <li onClick={logout}>
                                <FiLogOut /> <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
