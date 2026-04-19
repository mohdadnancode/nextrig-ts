import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    name: String,

    discountPercentage: {
        type: Number,
        required: true
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

    category: String, // optional (apply to category)

    startDate: Date,
    endDate: Date,

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);