import React, { useEffect, useState } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronDown, FaEdit, FaSave } from 'react-icons/fa';

const List = () => {
  const [list, setList] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editPriceId, setEditPriceId] = useState(null);
  const [editedPrices, setEditedPrices] = useState({});

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

  const removeFood = async (foodId) => {
    try {
      console.log("Removing food item with ID:", foodId);
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error deleting food");
      }
    } catch (error) {
      toast.error("Server error while deleting");
      console.error("Remove Food Error:", error);
    }
  };

  const handleEditPrice = (foodId, currentPrice) => {
    setEditPriceId(foodId);
    setEditedPrices({ ...editedPrices, [foodId]: currentPrice.toString() });
  };

  const handlePriceChange = (foodId, newPrice) => {
    if (newPrice === "" || /^\d*$/.test(newPrice)) {
      setEditedPrices((prevPrices) => ({
        ...prevPrices,
        [foodId]: newPrice,
      }));
    }
  };

  const handleSavePrice = async (foodId) => {
    try {
      console.log("Updating food price with ID:", foodId, "New Price:", editedPrices[foodId]);

      const response = await axios.post(`${url}/api/food/updatePrice`, {
        id: foodId,
        price: editedPrices[foodId],
      });

      console.log("Backend Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        setEditPriceId(null);
        fetchList();
      } else {
        toast.error("Error updating price");
      }
    } catch (error) {
      console.error("Update Price Error:", error.response ? error.response.data : error.message);
      toast.error("Server error while updating price");
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategories();
  }, [category]);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>

      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
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

        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {editPriceId === item._id ? (
                  <>
                    <input
                      type="text"
                      value={editedPrices[item._id] || ""}
                      onChange={(e) => handlePriceChange(item._id, e.target.value)}
                    />
                    <FaSave className="cursor" onClick={() => handleSavePrice(item._id)} />
                  </>
                ) : (
                  <>
                    {currency}{item.price}
                    <FaEdit className="cursor" onClick={() => handleEditPrice(item._id, item.price)} />
                  </>
                )}
              </p>
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