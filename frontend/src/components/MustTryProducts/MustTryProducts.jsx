import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./MustTryProducts.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const MustTryProducts = () => {
    const { mustTryItems, currency, url, addToCart } = useContext(StoreContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState("");
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mustTryItems.length);
            setExpanded(false);
        }, 6000);
        return () => clearInterval(interval);
    }, [mustTryItems.length]);

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mustTryItems.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + mustTryItems.length) % mustTryItems.length);
    };

    const handleQuantityChange = (e) => {
        const newValue = e.target.value;
        if (newValue === "" || (!isNaN(newValue) && Number(newValue) > 0)) {
            setQuantity(newValue);
        }
    };

    const handleBlur = () => {
        if (Number(quantity) < 1) {
            setQuantity(1);
        }
    };

    const handleArrowClick = (direction) => {
        setQuantity((prev) => {
            let newQuantity = Number(prev) || 1;
            if (direction === "up") newQuantity += 1;
            if (direction === "down") newQuantity = Math.max(1, newQuantity - 1);
            return newQuantity;
        });
    };

    const handleAddToCart = async () => {
        if (quantity === "") {
            toast.error("⚠️ Enter the quantity of food!", { position: "top-center", autoClose: 3000 });
            return;
        }

        const item = mustTryItems[currentIndex];
        const finalQuantity = Number(quantity);

        try {
            await addToCart(item._id, finalQuantity);
            toast.success(`🛒 ${item.name} is added to cart!`, {
                position: "top-center",
                autoClose: 1000,
                onClose: () => navigate("/cart")
            });
        } catch (error) {
            toast.error("❌ Failed to add item to cart", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="must-try-section">
            <h2>Must Try Products</h2>
            <div className="must-try-container">
                {mustTryItems.length > 0 ? (
                    <div className="must-try-slider">
                        <button className="slider-arrow left-arrow" onClick={goToPrevious}>&lt;</button>
                        <div className="must-try-card">
                            <div className="must-try-img-container">
                                <img
                                    src={`${url}/images/${mustTryItems[currentIndex].image}`}
                                    alt={mustTryItems[currentIndex].name}
                                    className="must-try-image"
                                />
                                {mustTryItems[currentIndex].mustTry && (
                                    <span className="must-try-badge">🔥 Must Try</span>
                                )}
                            </div>
                            <div className="must-try-info">
                                <h3 className="must-try-name">{mustTryItems[currentIndex].name}</h3>

                                <p className={`food-item-desc ${expanded ? "expanded" : ""}`}>
                                    {mustTryItems[currentIndex].description}
                                </p>
                                {mustTryItems[currentIndex].description.length > 100 && (
                                    <span className="read-more" onClick={toggleDescription}>
                                        {expanded ? "Read Less" : "Read More"}
                                    </span>
                                )}

                                <p className="must-try-price">
                                    {currency} {mustTryItems[currentIndex].price}
                                </p>

                                <div className="quantity-unit-container">
                                    <div className="quantity-control">
                                        <button
                                            className="quantity-arrow down-arrow"
                                            onClick={() => handleArrowClick("down")}
                                        >
                                            ▼
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            onBlur={handleBlur}
                                            placeholder="1"
                                            className="quantity-input"
                                        />
                                        <button
                                            className="quantity-arrow up-arrow"
                                            onClick={() => handleArrowClick("up")}
                                        >
                                            ▲
                                        </button>
                                    </div>
                                </div>
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                        <button className="slider-arrow right-arrow" onClick={goToNext}>
                            &gt;
                        </button>
                    </div>
                ) : (
                    <p>No must-try items available.</p>
                )}
            </div>
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default MustTryProducts;
