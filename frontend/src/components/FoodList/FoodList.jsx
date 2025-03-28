import React, { useContext } from 'react';
import './FoodList.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodList = ({ category }) => {
  const { filteredFoodList } = useContext(StoreContext); // Use filteredFoodList instead of food_list

  // Filter items based on category (search is already handled by context)
  const filteredItems = filteredFoodList.filter(item => 
    !category || item.category === category || category === "All"
  );

  return (
    <div className='food-list'>
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            description={item.description}
            mustTry={item.mustTry}
          />
        ))
      ) : (
        <p className="no-results">No food items found!</p>
      )}
    </div>
  );
};

export default FoodList;