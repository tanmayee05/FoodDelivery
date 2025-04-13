import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets, url } from '../../assets/assets';
import './Home.css';

const Home = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [canceledOrders, setCanceledOrders] = useState(0);
  const [outForDeliveryOrders, setOutForDeliveryOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchOrderStats = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const orders = response.data.data;

        setTotalOrders(orders.length);
        setDeliveredOrders(orders.filter((order) => order.status === 'Delivered').length);
        setCanceledOrders(orders.filter((order) => order.status === 'User Canceled').length);
        setOutForDeliveryOrders(orders.filter((order) => order.status === 'Out for delivery').length);
      } else {
        toast.error('Error fetching order statistics.');
      }
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      toast.error('Error fetching order statistics.');
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setTotalItems(response.data.data.length);
      } else {
        toast.error('Error fetching food items.');
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Error fetching food items.');
    }
  };

  useEffect(() => {
    fetchOrderStats();
    fetchFoodItems();
  }, []);

  return (
    <div className="home-container">
      <h2>Admin Dashboard</h2>
      <div className="order-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="stat-card delivered">
          <h3>Delivered Orders</h3>
          <p>{deliveredOrders}</p>
        </div>
        <div className="stat-card canceled">
          <h3>Canceled Orders</h3>
          <p>{canceledOrders}</p>
        </div>
        <div className="stat-card out-for-delivery">
          <h3>Out for Delivery</h3>
          <p>{outForDeliveryOrders}</p>
        </div>
        <div className="stat-card items">
          <h3>Total Items</h3>
          <p>{totalItems}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
