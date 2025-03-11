import React, { useContext } from "react";
import "./ProductCard.css";
import { StoreContext } from "../../Context/StoreContext";

const ProductCard = ({ id, image, name, price }) => {
  const { addToCart, currency } = useContext(StoreContext);

  return (
    <div className="product-card">
      <img className="product-image" src={image} alt={name} />
      <h3>{name}</h3>
      <p className="product-price">{currency} {price}</p>
      <button onClick={() => addToCart(id)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
