import React, { useContext } from 'react';
import './FoodList.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodList = ({ category, searchQuery }) => {
  const { food_list } = useContext(StoreContext);

  // Filter items based on category and search query
  const filteredItems = food_list.filter(item => 
    (!category || item.category === category) && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='food-list'>
      {filteredItems.length > 0 ? (
        filteredItems.map((item, index) => <FoodItem key={index} item={item} />)
      ) : (
        <p className="no-results">No food items found!</p>
      )}
    </div>
  );
};

export default FoodList;
