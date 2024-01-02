import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    pcNum: {
        type: String,
    },
    products: {
        type: Array,
    },
    total : {
        type: Number,
    }
}, { 
    timestamps: true
});

const Order = mongoose.model("Orders", OrderSchema);

export default Order;