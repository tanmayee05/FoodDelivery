import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Get all food items with optional category filter
const listFood = async (req, res) => {
    try {
        const category = req.query.category || null;  // Get category from query
        let filter = category ? { category } : {};  // Apply filter only if category is provided
        const foods = await foodModel.find(filter);
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("Error fetching food list:", error);
        res.status(500).json({ success: false, message: "Error fetching food list" });
    }
};

// Add food
const addFood = async (req, res) => {
    try {
        let image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            mustTry: req.body.mustTry || false, // Ensure mustTry field is stored
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};

// Delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        // Delete image from filesystem
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) console.error("Error deleting image:", err);
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error("Error removing food:", error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};

// Get "Must Try" food items
const listMustTryFood = async (req, res) => {
    try {
        const mustTryFoods = await foodModel.find({ mustTry: true });
        res.json({ success: true, data: mustTryFoods });
    } catch (error) {
        console.error("Error fetching must-try food items:", error);
        res.status(500).json({ success: false, message: "Failed to fetch must-try items" });
    }
};



export { listFood, addFood, removeFood, listMustTryFood };
