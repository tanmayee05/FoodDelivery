import React, { useState } from 'react';
import './Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Veg Pickles",
        mustTry: false  // New field for "Must Try"
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("mustTry", data.mustTry);  // Send "Must Try" status
        formData.append("image", image);

        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setData({ name: "", description: "", price: "", category: data.category, mustTry: false });
            setImage(false);
        } else {
            toast.error(response.data.message);
        }
    };

    const onChangeHandler = (event) => {
        const { name, value, type, checked } = event.target;
        setData(data => ({
            ...data,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload image</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Product name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Type here' required />
                </div>
                <div className='add-product-description flex-col'>
                    <p>Product description</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} rows={6} placeholder='Write content here' required />
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Product category</p>
                        <select name='category' onChange={onChangeHandler} value={data.category}>
                            <option value="Veg Pickles">Veg Pickles</option>
                            <option value="Non-Veg Pickle">Non-Veg Pickle</option>
                            <option value="Powder">Powder</option>
                            <option value="Sweets">Sweets</option>
                            <option value="Hots">Hots</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='25' />
                    </div>
                </div>
                
                {/* Checkbox for Must Try */}
                <div className="add-must-try">
                    <label>
                        <input type="checkbox" name="mustTry" onChange={onChangeHandler} checked={data.mustTry} />
                        Mark as "Must Try Item"
                    </label>
                </div>

                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    );
};

export default Add;
