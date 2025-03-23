import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const url = "http://localhost:4000";

    const [food_list, setFoodList] = useState([]);
    const [mustTryItems, setMustTryItems] = useState([]); // ✅ Stores "Must Try" Items
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const currency = "₹";
    const deliveryCharge = 50;

    // ✅ Fetch Food List and Must Try Items
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            const foodData = response.data?.data || [];
            setFoodList(foodData);

            // ✅ Find all "Must Try" items
            setMustTryItems(foodData.filter((item) => item.mustTry === true));
        } catch (error) {
            console.error("❌ Error fetching food list:", error);
        }
    };

    // ✅ Add to cart quantity

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
    

    // ✅ Remove Item from Cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) };
            if (updatedCart[itemId] === 0) delete updatedCart[itemId]; // Remove item if count is 0
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

    // ✅ Calculate Total Cart Amount
    const getTotalCartAmount = () => {
        return food_list.reduce((total, item) => {
            return total + ((cartItems[item._id] || 0) * item.price);
        }, 0);
    };

    

    // ✅ Load Cart Data from API
    const loadCartData = async () => {
        if (!token) return;
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.error("❌ Error loading cart data:", error);
        }
    };

    // ✅ Fetch Data on Load
    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();
            if (token) {
                await loadCartData();
            }
        };
        loadData();
    }, [token]);

    // ✅ Context Value
    const contextValue = {
        url,
        food_list,
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
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
