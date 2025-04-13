import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: {type:String,required:true},
    items: { type: Array, required:true},
    amount: { type: Number, required: true},
    address:{type:Object,required:true},
    status: {type:String,default:"Order pick up"},
    date: {type:Date,default:Date.now()},
    payment:{type:Boolean,default:false},
    feedback: { type: String, default: "" },
    rating: { type: Number, default: 0 }
}, { timestamps: true })

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;