import express from 'express';
import productModel from '../models/Product.js'
import multer from 'multer';
import cloudinary from '../cloudinary.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productRoutes = express.Router();

const upload = multer({ dest: `${__dirname}../../../Order Cart/images`}); // Set your upload directory

// GET ALL THE PRODUCTS
productRoutes.get('/Products', async (req, res) => {
    try {
        const products = await productModel.find({});
        res.send(products);
        console.log('Successful getting all products data');
    } catch (error) {
        res.status(500).json({ message: "Error Getting all products Data", error });
    }
});

// GET ONLY PRODUCTS AVAILABLE (WITH STOCKS > 0 VALUE)
productRoutes.get('/Products/In-Stock', async (req, res) => {
    try {
        const products = await productModel.find({ stock: { $gt: 0 } });
        res.send(products);
        console.log('Successful getting products data');
    } catch (error) {
        res.status(500).json({ message: "Error Getting products Data", error });
    }
});

productRoutes.post('/Products', upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new product with Cloudinary URL
        const newProduct = new productModel({
            name: name,
            price: price,
            image: result.secure_url, // Use the secure_url provided by Cloudinary
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Respond with the saved product
        res.status(201).json(savedProduct);
        console.log('Product created successfully');
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
});

productRoutes.put('/Products/:productId/addStock', async (req, res) => {
    const productId = req.params.productId;
    const { quantity } = req.body;

    try {
        // Find the product by 'id'
        const product = await productModel.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update the stock value
        product.stock += parseInt(quantity);

        // Save the product without triggering the pre('save') middleware
        await productModel.updateOne({ id: productId }, { $set: { stock: product.stock } });

        // Fetch the updated product to include all fields
        const updatedProduct = await productModel.findOne({ id: productId });

        res.status(200).json({ message: "Stock updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock", error });
    }
});

export default productRoutes;