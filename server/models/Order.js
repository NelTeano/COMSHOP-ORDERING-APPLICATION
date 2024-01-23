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
    },
    status : {
        type: String,
    },
    comment : {
        type: String,
    }
}, { 
    timestamps: true
});

const Order = mongoose.model("Orders", OrderSchema);

export default Order;