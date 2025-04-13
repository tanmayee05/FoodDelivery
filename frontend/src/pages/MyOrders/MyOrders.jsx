import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, currency } = useContext(StoreContext);
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState({});

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      if (response.data.success) {
        setData(response.data.data.reverse());
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
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
        ));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel order.");
    }
  };

  const handleFeedbackSubmit = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/feedback", {
        orderId,
        feedback: feedback[orderId],
        rating: rating[orderId],
      }, { headers: { token } });

      if (response.data.success) {
        toast.success("Feedback submitted!");
        fetchOrders(); // Refresh orders
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch (error) {
      toast.error("Error submitting feedback.");
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
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt="" />
            <p>{order.items.map((item, i) => `${item.name} x ${item.quantity}${i === order.items.length - 1 ? '' : ', '}`)}</p>
            <p>{currency}{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p className='order-status'>
              <span>● {order.status}</span><br />
              <span className='order-date'>
                Placed on: {order.date ? new Date(order.date).toLocaleString() : "Invalid Date"}
              </span>
            </p>

            {order.status !== 'Delivered' && order.status !== 'Out for delivery' && order.status !== 'User Canceled' && (
              <button onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
            )}

            {order.status === 'Delivered' && !order.feedback && (
              <div className="feedback-form">
                <p>Give your feedback:</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setRating({ ...rating, [order._id]: s })}
                      className={rating[order._id] >= s ? "star selected" : "star"}
                    >★</span>
                  ))}
                </div>
                <textarea
                  placeholder="Your feedback..."
                  onChange={(e) => setFeedback({ ...feedback, [order._id]: e.target.value })}
                  value={feedback[order._id] || ''}
                />
                <button onClick={() => handleFeedbackSubmit(order._id)}>Submit</button>
              </div>
            )}

            {order.feedback && (
              <div className="feedback-display">
                <strong>Feedback:</strong>
                <p>{order.feedback}</p>
                <p>Rating: {order.rating} ★</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
