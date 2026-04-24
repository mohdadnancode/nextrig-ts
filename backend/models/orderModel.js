import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String,
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderItemSchema],

        totalAmount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["UPI", "card", "cod"],
            required: true,
        },

        paymentDetails: {
            type: Object,
        },

        shippingAddress: {
            fullName: String,
            address: String,
            city: String,
            pincode: String,
            mobileNumber: String,
        },

        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending",
        },

        cancelledAt: Date,
        cancelledBy: {
            type: String,
            enum: ["user", "admin"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);