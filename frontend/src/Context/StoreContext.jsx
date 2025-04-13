import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const url = "http://localhost:4000";

    const [food_list, setFoodList] = useState([]);
    const [filteredFoodList, setFilteredFoodList] = useState([]);
    const [mustTryItems, setMustTryItems] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [searchQuery, setSearchQuery] = useState(""); // Track search query state
    const currency = "₹";
    const deliveryCharge = 50;

    // Fetch Food List and Must Try Items
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            const foodData = response.data?.data || [];
            setFoodList(foodData);
            setFilteredFoodList(foodData);
            setMustTryItems(foodData.filter((item) => item.mustTry === true));
        } catch (error) {
            console.error("❌ Error fetching food list:", error);
        }
    };

    // Search food items
    const searchFood = (query) => {
        setSearchQuery(query); // Store the search query
        if (!query) {
            setFilteredFoodList(food_list);
            return;
        }
        const lowerCaseQuery = query.toLowerCase();
        const filtered = food_list.filter(item => 
            item.name.toLowerCase().includes(lowerCaseQuery) ||
            item.description.toLowerCase().includes(lowerCaseQuery) ||
            item.category.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredFoodList(filtered);
    };

    // Clear search and reset filtered list
    const clearSearch = () => {
        setSearchQuery("");
        setFilteredFoodList(food_list);
    };

    // Get items filtered by category (ignoring search when needed)
    const getItemsByCategory = (category) => {
        if (searchQuery) {
            // If there's an active search, filter the already filtered list
            return filteredFoodList.filter(item => 
                category === "All" || item.category === category
            );
        }
        // Otherwise, filter the full list
        return food_list.filter(item => 
            category === "All" || item.category === category
        );
    };

    const addToCart = async (itemId, quantity) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + quantity, 
        }));
    
        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`, { itemId, quantity }, { headers: { token } });
            } catch (error) {
                console.error("❌ Error adding item to cart:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) };
            if (updatedCart[itemId] === 0) delete updatedCart[itemId];
            return updatedCart;
        });

        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
            } catch (error) {
                console.error("❌ Error removing item from cart:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        return food_list.reduce((total, item) => {
            return total + ((cartItems[item._id] || 0) * item.price);
        }, 0);
    };

    const loadCartData = async () => {
        if (!token) return;
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.error("❌ Error loading cart data:", error);
        }
    };

    const updateCartItem = async (itemId, newQuantity) => {
        setCartItems(prev => {
            const updated = {...prev};
            if (newQuantity > 0) {
                updated[itemId] = newQuantity;
            } else {
                delete updated[itemId];
            }
            return updated;
        });
    
        if (token) {
            try {
                await axios.post(`${url}/api/cart/update`, 
                    { itemId, quantity: newQuantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Error updating cart:", error);
                setCartItems(prev => ({...prev}));
            }
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();
            if (token) {
                await loadCartData();
            }
        };
        loadData();
    }, [token]);

    const contextValue = {
        url,
        food_list,
        filteredFoodList,
        mustTryItems,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        updateCartItem,
        searchFood,
        clearSearch,
        getItemsByCategory, // Add this new function
        searchQuery // Expose search query state
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;