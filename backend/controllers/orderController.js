import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            items,
            totalAmount,
            paymentMethod,
            paymentDetails,
            shippingAddress,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            paymentMethod,
            paymentDetails,
            shippingAddress,
        });

        await User.findByIdAndUpdate(userId, {
            $push: { orders: order._id },
            $set: { cart: [] }, // clear cart after order
        });

        res.status(201).json(order);
    } catch (err) {
        console.error("ORDER ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};


// GET USER ORDERS
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// CANCEL ORDER

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        console.log("ORDER:", order);
        console.log("USER:", req.user._id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({ message: "Order already cancelled" });
        }

        if (order.status === "shipped") {
            return res.status(400).json({ message: "Cannot cancel shipped order" });
        }

        if (order.status === "delivered") {
            return res.status(400).json({ message: "Cannot cancel delivered order" });
        }

        order.status = "cancelled";
        order.cancelledAt = new Date();
        order.cancelledBy = "user";

        await order.save();

        res.json({ message: "Order cancelled successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};