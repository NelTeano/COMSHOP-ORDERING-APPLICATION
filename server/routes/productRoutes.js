import express from 'express';
import productModel from '../models/Product.js'

const productRoutes = express.Router();

productRoutes.get('/Products', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.send(products);
        console.log('Successful getting products data');
    } catch (error) {
        res.status(500).json({ message: "Error Getting products Data", error });
    }
});

productRoutes.post('/Products', async (req, res) => {
    try {
        const { name, price, image } = req.body;

        const newProduct = new productModel({
            name: name,
            price: price,
            image: image,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
        console.log('Product created successfully');
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
});

export default productRoutes;