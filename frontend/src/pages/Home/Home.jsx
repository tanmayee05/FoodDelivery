import React, { useState, useContext } from "react";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import ProductCard from "../../components/ProductCard/ProductCard";
import { StoreContext } from "../../Context/StoreContext";
import MustTryProducts from "../../components/MustTryProducts/MustTryProducts";

const Home = () => {
  const [category, setCategory] = useState("All");
  const { food_list } = useContext(StoreContext); // Getting products from context

  // Sample removeProduct function (Modify as needed)
  const removeProduct = (id) => {
    console.log("Removing product with ID:", id);
  };

  return (
    <>
      
      
      <MustTryProducts/>

      <ExploreMenu setCategory={setCategory} category={category} />
      <FoodDisplay category={category} />
     
    </>
  );
};

export default Home;
