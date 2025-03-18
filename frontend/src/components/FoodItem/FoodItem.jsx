import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../Context/StoreContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const FoodItem = ({ image, name, price, desc, id, mustTry }) => {
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);
    const [quantity, setQuantity] = useState(""); // Allow empty input
    const [unit, setUnit] = useState("kgs"); 

    // Handle quantity change
    const handleQuantityChange = (e) => {
        const newValue = e.target.value;
        if ((!isNaN(newValue) && Number(newValue) > 0)) {
            setQuantity(newValue);
        }
    };

    // Ensure a valid number when the input loses focus
    const handleBlur = () => {
        if ( Number(quantity) < 1) {
            setQuantity(1);
        }
    };

    

    // Handle arrow clicks (up and down)
    const handleArrowClick = (direction) => {
        setQuantity((prev) => {
            let newQuantity = Number(prev) || 1;
            if (direction === "up") newQuantity += 1;
            if (direction === "down") newQuantity = Math.max(1, newQuantity - 1);
            return newQuantity;
        });
    };

    // Handle adding to cart
    const handleAddToCart = () => {
        if (quantity === "") {
            toast.error("⚠️ Enter the quantity of food!", { position: "top-center", autoClose: 3000 });
            return;
        }
    
        const finalQuantity = Number(quantity);
        addToCart(id, finalQuantity, unit);
    
        toast.success(`🛒 ${name} is added to cart!`, { position: "top-center", autoClose: 3000 });
    };
    

    

    return (
        <div className={`food-item ${mustTry ? "must-try" : ""}`}>
            <div className="food-item-img-container">
                <img className="food-item-image" src={`${url}/images/${image}`} alt={name} />
                
                {/* Must Try Badge */}
                {mustTry && <span className="must-try-badge">🔥 Must Try</span>}

                {/* Quantity Input and Unit Selection */}
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
                    <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="unit-select"
                    >
                        <option value="kgs">kgs</option>
                        <option value="grams">grams</option>
                    </select>
                </div>

                {/* Add to Cart Button */}
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>

            <div className="food-item-info">
                <h3 className="food-item-name">{name}</h3>
                {desc && <p className="food-item-desc">{desc}</p>}
                <p className="food-item-price">{currency} {price}</p>
                <p>Price per Kg</p>
                


            </div>
        </div>
    );
};

export default FoodItem;
