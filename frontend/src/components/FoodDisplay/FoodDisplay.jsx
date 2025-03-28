import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { getItemsByCategory, searchQuery } = useContext(StoreContext);
  const categoryItems = getItemsByCategory(category);

  return (
    <div className="food-display" id="food-display">
      <h2>🍽️ Top Dishes Near You</h2>
      {searchQuery && categoryItems.length === 0 ? (
        <p className="no-results">No items found matching your search in this category.</p>
      ) : categoryItems.length === 0 ? (
        <p className="no-results">No items found in this category.</p>
      ) : (
        <div className="food-display-list">
          {categoryItems.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              description={item.description}
              mustTry={item.mustTry}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;