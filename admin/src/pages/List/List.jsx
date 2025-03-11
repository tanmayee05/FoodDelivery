import React, { useEffect, useState } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronDown } from 'react-icons/fa';

const List = () => {
  const [list, setList] = useState([]); // List of food items
  const [category, setCategory] = useState(""); // Selected category filter
  const [categories, setCategories] = useState([]); // List of unique categories
  const [dropdownOpen, setDropdownOpen] = useState(false); // Toggle dropdown

  // Fetch food list
  const fetchList = async () => {
    try {
      console.log("Fetching food list...");
      const response = await axios.get(`${url}/api/food/list`, { params: { category } });
      
      if (response.data.success) {
        setList(response.data.data);
        console.log("Food list:", response.data.data);
      } else {
        toast.error("Error fetching food items");
      }
    } catch (error) {
      toast.error("Server error");
      console.error("Fetch List Error:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await axios.get(`${url}/api/food/list`);
      
      if (response.data.success) {
        const uniqueCategories = [...new Set(response.data.data.map(item => item.category))];
        setCategories(uniqueCategories);
        console.log("Categories:", uniqueCategories);
      }
    } catch (error) {
      toast.error("Error fetching categories");
      console.error("Fetch Categories Error:", error);
    }
  };

  // Remove food item
  const removeFood = async (foodId) => {
    try {
      console.log("Removing food item with ID:", foodId);
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh list after deletion
      } else {
        toast.error("Error deleting food");
      }
    } catch (error) {
      toast.error("Server error while deleting");
      console.error("Remove Food Error:", error);
    }
  };

  // Fetch data on component mount and when category changes
  useEffect(() => {
    fetchList();
    fetchCategories();
  }, [category]);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>

      <div className='list-table'>
        {/* Table Header */}
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>

          {/* Category Header with Dropdown */}
          <div 
            className={`category-header ${dropdownOpen ? "open" : ""}`} 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <b>Category</b>
            <FaChevronDown className="dropdown-arrow" />
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                <p onClick={() => { setCategory(""); setDropdownOpen(false); }}>All Categories</p>
                {categories.map((cat, index) => (
                  <p key={index} onClick={() => { setCategory(cat); setDropdownOpen(false); }}>{cat}</p>
                ))}
              </div>
            )}
          </div>

          <b>Price</b>
          <b>Action</b>
        </div>

        {/* Table Rows */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
            </div>
          ))
        ) : (
          <p className="no-items">No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default List;
