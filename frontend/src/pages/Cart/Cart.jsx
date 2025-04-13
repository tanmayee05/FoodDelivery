import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    food_list, 
    removeFromCart, 
    getTotalCartAmount, 
    url, 
    currency, 
    deliveryCharge, 
    updateCartItem 
  } = useContext(StoreContext);
  
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    await updateCartItem(itemId, newQuantity);
  };

  const incrementQuantity = (itemId) => {
    const currentQuantity = cartItems[itemId] || 1;
    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const decrementQuantity = (itemId) => {
    const currentQuantity = cartItems[itemId] || 1;
    if (currentQuantity > 1) {
      handleQuantityChange(itemId, currentQuantity - 1);
    }
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{currency}{item.price}</p>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn minus" 
                      onClick={() => decrementQuantity(item._id)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={cartItems[item._id] || 1}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn plus" 
                      onClick={() => incrementQuantity(item._id)}
                    >
                      +
                    </button>
                  </div>
                  <p>{currency}{item.price * (cartItems[item._id] || 1)}</p>
                  <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;