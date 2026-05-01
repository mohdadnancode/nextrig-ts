import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false },
});

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        isVerified: { type: Boolean, default: false },

        profileImage: {
            url: String,
            public_id: String,
        },

        addresses: {
            type: [addressSchema],
            validate: {
                validator: (arr) => arr.length <= 4,
                message: "Maximum 4 addresses allowed",
            },
        },

        cart: [cartItemSchema],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);