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


orderRoutes.post('/submit-order',async (req,res)=>{
    
    const orderDetails = new orderModel({
        pcNum: req.body.pcNum,
        products: req.body.products,
        total: req.body.total
    })

    try {   
        const saveOrderData = await orderDetails.save();
        res.send(saveOrderData);
        console.log("Successfully placed an order");

    } catch (error) {
        res.status(500).json({ message: "order failed" , error });
        console.log("Failed creating an order");
    }
})

export default orderRoutes;