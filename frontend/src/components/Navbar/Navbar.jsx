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
        const handleResize = () => setIsMobileView(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        navigate('/');
    };

    const handleNavigation = (sectionId, menuName) => {
        setMenu(menuName);
        setScrollToSection(sectionId);
        navigate('/');
        setHamburgerMenu(false);
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        searchFood(val);
        if (location.pathname !== '/') navigate('/');
        setTimeout(() => {
            const section = document.getElementById('food-display');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchFood(searchQuery);
        navigate('/');
        setScrollToSection('food-display');
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
                            <li onClick={() => handleNavigation('top-image', 'home')}>Home</li>
                            <li onClick={() => handleNavigation('explore-menu', 'menu')}>Menu</li>
                            <li onClick={() => handleNavigation('about-us-section', 'about')}>About Us</li>
                            <li onClick={() => handleNavigation('contact-us-section', 'contact')}>Contact Us</li>
                        </ul>
                    </div>
                </>
            ) : (
                <ul className="navbar-menu">
                    <li className={menu === 'home' ? 'active' : ''} onClick={() => handleNavigation('top-image', 'home')}>Home</li>
                    <li className={menu === 'menu' ? 'active' : ''} onClick={() => handleNavigation('explore-menu', 'menu')}>Menu</li>
                    <li className={menu === 'about' ? 'active' : ''} onClick={() => handleNavigation('about-us-section', 'about')}>About Us</li>
                    <li className={menu === 'contact' ? 'active' : ''} onClick={() => handleNavigation('contact-us-section', 'contact')}>Contact Us</li>
                </ul>
            )}

            <div className="navbar-right">
                <form className="search-bar" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button type="submit">
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
                    <button onClick={() => setShowLogin(true)}>Login</button>
                ) : (
                    <div className="navbar-profile">
                        <FiUser className="navbar-icon" />
                        <ul className="navbar-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}>
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
