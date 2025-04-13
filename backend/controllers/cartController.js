import userModel from "../models/userModel.js"

// add to user cart  
const addToCart = async (req, res) => {
   try {
      let userData = await userModel.findOne({_id:req.body.userId});
      let cartData = await userData.cartData;
      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      }
      else {
         cartData[req.body.itemId] += 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }

}

// get user cart
const getCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      res.json({ success: true, cartData:cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// Add to cartController.js
// Add to cartController.js
// Add this to your existing cartController.js
const updateCart = async (req, res) => {
   try {
     let userData = await userModel.findById(req.body.userId);
     let cartData = userData.cartData;
     
     if (req.body.quantity > 0) {
       cartData[req.body.itemId] = req.body.quantity;
     } else {
       delete cartData[req.body.itemId];
     }
     
     await userModel.findByIdAndUpdate(req.body.userId, { cartData });
     res.json({ success: true, message: "Cart Updated", cartData });
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: "Error" });
   }
 }
 


export { addToCart, removeFromCart, getCart,updateCart }