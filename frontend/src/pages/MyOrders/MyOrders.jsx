// MyOrders.jsx
import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      if (response.data.success) {
        setData(response.data.data.reverse()); // Reverse orders to show recent ones first
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders.");
    }
  };
  

  const handleCancelOrder = async (orderId) => {
  try {
    const response = await axios.post(url + "/api/order/cancel", { orderId }, { headers: { token } });
    if (response.data.success) {
      toast.success(response.data.message);
      setData(prevData => prevData.map(order => 
        order._id === orderId ? { ...order, status: "User Canceled" } : order
      )); // Update status in state to remove button
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Error canceling order:", error);
    toast.error("Failed to cancel order.");
  }
};


  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity;
                } else {
                  return item.name + " x " + item.quantity + ", ";
                }
              })}</p>
              <p>{currency}{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p className='order-status'>
  <span>● {order.status}</span>
  <br />
  <span className='order-date'>
    Placed on: {order.date ? new Date(order.date).toLocaleString() : "Invalid Date"}
  </span>
</p>


              {order.status !== 'Delivered' && order.status !== 'Out for delivery' && order.status !== 'User Canceled' && (
   <button onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
)}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;