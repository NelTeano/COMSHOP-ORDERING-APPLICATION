import express from 'express';
import orderModel from '../models/Order.js';

const orderRoutes = express.Router();

// GET ALL PENDING ORDERS
orderRoutes.get('/Orders/pending', async (req, res) => {
    try {
        const orders = await orderModel.find({status: 'pending'});
        res.send(orders);
        console.log('Successful getting PENDING Orders data');
    } catch (error) {
        res.status(500).json({ message: "Error Getting PENDING Data", error });
    }
});

// GET ALL DONE ORDERS
orderRoutes.get('/Orders/done', async (req, res) => {
    try {
        const orders = await orderModel.find({status: 'done'});
        res.send(orders);
        console.log('Successful getting DONE Orders data');
    } catch (error) {
        res.status(500).json({ message: "Error Getting DONE Orders Data", error });
    }
});

// GET ALL ORDERS
orderRoutes.get('/Orders/all', async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.send(orders);
        console.log('Successful getting ALL Orders data');
    } catch (error) {
        res.status(500).json({ message: "Error Getting Orders Data", error });
    }
});

// SUBMIT ORDER
orderRoutes.post('/submit-order',async (req,res)=>{
    
    const orderDetails = new orderModel({
        pcNum: req.body.pcNum,
        products: req.body.products,
        total: req.body.total,
        status: 'pending',
        comment: req.body.comment
    })

    try {   
        const saveOrderData = await orderDetails.save();
        res.send(saveOrderData);
        console.log("Successfully placed an order");

    } catch (error) {
        res.status(500).json({ message: "order failed" , error });
        console.log("Failed creating an order");
    }
});

// MARK US DONE ORDER
orderRoutes.post('/mark-as-done/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        // Find the order by ID
        const order = await orderModel.findById(orderId);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        // Update the order status to 'done'
        order.status = 'done';
        await order.save();

        res.json({ message: 'Order marked as done successfully' });
        console.log('Order marked as done successfully');
    } catch (error) {
        res.status(500).json({ message: 'Error marking order as done', error });
        console.error('Error marking order as done', error);
    }
});

export default orderRoutes;