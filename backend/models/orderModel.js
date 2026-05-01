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
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderItemSchema],

        itemsTotal: {
            type: Number,
            default: 0,
        },

        shippingCharge: {
            type: Number,
            default: 0,
        },

        codFee: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            default: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["online", "cod"],
            required: true,
        },

        paymentDetails: {
            type: Object,
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        paidAt: Date,

        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,

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

        expiresAt: {
            type: Date,
        },

        shippedAt: Date,
        deliveredAt: Date,
        cancelledAt: Date,
        cancelledBy: {
            type: String,
            enum: ["user", "admin", "system"],
        },
    },
    { timestamps: true }
);

orderSchema.pre("save", function (next) {
    if (!this.itemsTotal) {
        this.itemsTotal = this.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    }

    if (this.shippingCharge === undefined) this.shippingCharge = 0;
    if (this.codFee === undefined) this.codFee = 0;

    this.totalAmount =
        this.itemsTotal + this.shippingCharge + this.codFee;

    next();
});

export default mongoose.model("Order", orderSchema);