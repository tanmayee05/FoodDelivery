import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://saikrisharava28:19112004Aa23@cluster0.6iw6f0d.mongodb.net/foodDeliveryDB?retryWrites=true&w=majority&appName=Cluster0/food-del_1').then(()=>console.log("DB Connected"));
   
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.