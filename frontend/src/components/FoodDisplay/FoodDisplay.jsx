import React, { useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display">
      <h2>🍽️ Top Dishes Near You</h2>
      <div className="food-display-list">
        {food_list.map((item) =>
          category === "All" || category === item.category ? (
            <FoodItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              desc={item.desc}
              mustTry={item.mustTry} // ✅ Ensure mustTry flag is passed
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
