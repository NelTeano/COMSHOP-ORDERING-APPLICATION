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


productRoutes.get('/Products', async (req, res) => {
    try {
        const products = await productModel.find({});
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

// productRoutes.post('/Products', async (req, res) => {
//     try {
//         const { name, price, image } = req.body;

//         const newProduct = new productModel({
//             name: name,
//             price: price,
//             image: image,
//         });

//         const savedProduct = await newProduct.save();

//         res.status(201).json(savedProduct);
//         console.log('Product created successfully');
//     } catch (error) {
//         res.status(500).json({ message: "Error creating product", error });
//     }
// });

export default productRoutes;