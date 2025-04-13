import express from 'express';
import { addFood, listFood, removeFood, listMustTryFood, updateFoodPrice } from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/must-try", listMustTryFood);  // Route for Must Try items
foodRouter.post('/updatePrice', updateFoodPrice);  // Corrected Route




export default foodRouter;
