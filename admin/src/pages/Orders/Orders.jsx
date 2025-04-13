import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error fetching orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders.");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        toast.success("Order status updated.");
        fetchAllOrders();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Filter orders based on selected status
  const filteredOrders = filterStatus === "All" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className='order add'>
      <h3>Order Page</h3>

      {/* Filter Dropdown */}
      <div className="filter-container">
        <label>Filter Orders:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Order pick up">Order pick up</option>
          <option value="Food Processing">Food Processing</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="order-list">
        {filteredOrders.map((order) => (
          <div key={order._id} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => 
                  `${item.name} x ${item.quantity}${index === order.items.length - 1 ? '' : ', '}`
                )}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
<p className='order-item-date'>Placed on: {new Date(order.createdAt).toLocaleString()}</p>

            </div>
            <p>Items: {order.items.length}</p>
            <p>{currency}{order.amount}</p>

            {order.status === "User Canceled" ? (
              <p className="canceled-text">User has canceled the order</p>
            ) : (
              <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                <option value="Order pick up">Order pick up</option>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
