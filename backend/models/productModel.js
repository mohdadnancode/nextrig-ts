import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: String,
    category: String,

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    description: String,

    images: [String],

    countInStock: {
        type: Number,
        required: true,
        default: 0
    },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    featured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },

    sku: { type: String, unique: true },

    specs: { type: Object }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);