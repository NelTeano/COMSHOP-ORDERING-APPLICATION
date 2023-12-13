import express from 'express';
import orderModel from '../models/Order.js';

const orderRoutes = express.Router();

orderRoutes.get('/Orders', async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.send(orders);
        console.log('Successful getting Orders data');
    } catch (error) {
        res.status(500).json({ message: "Error Getting Orders Data", error });
    }
});

export default orderRoutes;