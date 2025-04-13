import React, { useState, useContext, useEffect } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../Context/StoreContext";
import MustTryProducts from "../../components/MustTryProducts/MustTryProducts";
import TopImage from "../../components/TopImage/TopImage";
import { useLocation } from "react-router-dom";
import AboutUs from '../../components/AboutUs/AboutUs';
import ContactUs from '../../components/ContactUs/ContactUs';
import LoginPopup from '../../components/LoginPopup/LoginPopup';

const Home = () => {
  const [category, setCategory] = useState("All");
  const { food_list } = useContext(StoreContext);
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (location.state?.scrollToMenu) {
      const menuSection = document.getElementById('explore-menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.scrollToContact) {
      const contactSection = document.getElementById('contact-us-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  const removeProduct = (id) => {
    console.log("Removing product with ID:", id);
  };

  return (
    <div className='home'>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <TopImage setShowLogin={setShowLogin} />
      <MustTryProducts/>
      <div id="explore-menu">
        <ExploreMenu setCategory={setCategory} category={category} />
      </div>
      <FoodDisplay category={category} />
      <div id="about-us-section">
        <AboutUs />
      </div>
      <div id="contact-us-section">
        <ContactUs />
      </div>
    </div>
  );
};

export default Home;
