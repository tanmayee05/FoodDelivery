import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodItem = ({ image, name, price, description = "", id, mustTry }) => {
  const { addToCart, url, currency } = useContext(StoreContext);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const MAX_DESCRIPTION_LENGTH = 100;
  const shouldTruncate = description.length > MAX_DESCRIPTION_LENGTH;

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && Number(value) > 0)) {
      setQuantity(value === "" ? "" : parseInt(value));
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => (prev === "" ? 2 : prev + 1));
  };

  const decrementQuantity = () => {
    setQuantity(prev => {
      const newValue = prev === "" ? 0 : prev - 1;
      return newValue < 1 ? 1 : newValue;
    });
  };

  const handleAddToCart = async () => {
    if (quantity < 1) {
      toast.error("⚠️ Quantity must be at least 1!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(id, Number(quantity));
      toast.success(`🛒 ${name} added to cart!`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("❌ Failed to add item to cart", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedDescription = isExpanded 
    ? description 
    : shouldTruncate 
      ? `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...` 
      : description;

  return (
    <div className={`food-item ${mustTry ? "must-try" : ""}`}>
      <div className="food-item-img-container">
        <img 
          className="food-item-image" 
          src={`${url}/images/${image}`} 
          alt={name} 
          loading="lazy"
        />

        {mustTry && (
          <span className="must-try-badge" aria-label="Must try item">
            🔥 Must Try
          </span>
        )}

        <div className="quantity-control-container">
          <div className="quantity-control">
            <button
              className="quantity-arrow"
              onClick={decrementQuantity}
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              min="1"
              className="quantity-input"
              aria-label="Quantity"
            />
            <button
              className="quantity-arrow"
              onClick={incrementQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            className={`add-to-cart-btn ${isAddingToCart ? "adding" : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={`Add ${name} to cart`}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="food-item-info">
        <h3 className="food-item-name">{name}</h3>

        <p className="food-item-desc">
          {displayedDescription}
          {shouldTruncate && (
            <button
              className="read-more-btn"
              onClick={toggleDescription}
              aria-label={isExpanded ? "Show less description" : "Show more description"}
            >
              {isExpanded ? " Read Less" : " Read More"}
            </button>
          )}
        </p>

        <div className="price-container">
          <p className="food-item-price">
            {currency} {price.toFixed(2)}
          </p>
          <p className="price-unit">per kg</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;