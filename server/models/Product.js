import mongoose from "mongoose";

const CounterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", CounterSchema);

const ProductSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
});

ProductSchema.pre('save', async function(next) {
    const doc = this;
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'id' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        
        doc.id = counter.sequence_value || counter;
        next();
    } catch (error) {
        return next(error);
    }
});


const Product = mongoose.model("Product", ProductSchema, "inventory");

export default Product;