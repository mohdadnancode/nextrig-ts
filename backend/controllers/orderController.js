import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js"
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { calculateOrderAmounts } from "../utils/orderCalculation.js";



// CREATE ORDER
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            items,
            paymentMethod,
            paymentDetails,
            shippingAddress,
            isBuyNow,
        } = req.body;

        // Basic validations
        if (!shippingAddress?.address || !shippingAddress?.city) {
            return res.status(400).json({ message: "Invalid address" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        if (!paymentMethod || !["online", "cod"].includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // STEP 1: VALIDATE + STOCK CHECK
        const COD_FEE = 15;
        const SHIPPING_THRESHOLD = 5000;
        const SHIPPING_FEE = 199;

        let itemsTotal = 0;
        const validatedItems = [];

        const isOnlinePayment = paymentMethod !== "cod";

        // Generate order number
        let orderNumber;
        let exists = true;

        while (exists) {
            orderNumber = generateOrderNumber();
            exists = await Order.findOne({ orderNumber });
        }

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product || product.countInStock < item.quantity) {
                return res.status(400).json({
                    message: "Stock changed or product unavailable",
                });
            }

            const price = product.price;
            itemsTotal += price * item.quantity;

            validatedItems.push({
                product: product._id,
                name: product.name,
                price,
                quantity: item.quantity,
                image: product.images?.[0]?.url || "",
                category: product.category,
            });

            if (!isOnlinePayment) {
                await Product.findByIdAndUpdate(product._id, {
                    $inc: { countInStock: -item.quantity },
                });
            }
        }

        // CALCULATE EXTRA CHARGES
        const {
            itemsTotal: finalItemsTotal,
            shippingCharge,
            codFee,
            totalAmount,
        } = calculateOrderAmounts(validatedItems, paymentMethod);

        const expiresAt =
            paymentMethod === "cod"
                ? null
                : new Date(Date.now() + 15 * 60 * 1000);

        // STEP 2: CREATE ORDER
        const order = await Order.create({
            orderNumber,
            user: userId,
            items: validatedItems,

            itemsTotal: finalItemsTotal,
            shippingCharge,
            codFee,
            totalAmount,

            paymentMethod,
            paymentDetails,
            expiresAt,
            shippingAddress,
        });

        // STEP 3: UPDATE USER
        const updateData = {
            $push: { orders: order._id },
        };

        if (!isBuyNow) {
            updateData.$set = { cart: [] };
        }

        await User.findByIdAndUpdate(userId, updateData);

        res.status(201).json({
            ...order.toObject(),
            breakdown: {
                itemsTotal,
                shippingCharge,
                codFee,
            }
        });

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

        // Fix image field for orders that stored [object Object] or empty strings
        const fixed = orders.map(order => {
            const obj = order.toObject();
            const {
                itemsTotal,
                shippingCharge,
                codFee,
                totalAmount,
            } = calculateOrderAmounts(obj.items, obj.paymentMethod);

            obj.itemsTotal = obj.itemsTotal ?? itemsTotal;
            obj.shippingCharge = obj.shippingCharge ?? shippingCharge;
            obj.codFee = obj.codFee ?? codFee;
            obj.totalAmount = obj.totalAmount ?? totalAmount;

            obj.items = obj.items.map(item => {
                if (!item.image || item.image === "[object Object]" || typeof item.image !== "string") {
                    const img = item.product?.images?.[0];
                    item.image = typeof img === "string" ? img : img?.url || "";
                }
                return item;
            });

            return obj;
        });

        res.json(fixed);
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

        if (order.paymentMethod === "cod" || order.isPaid) {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { countInStock: item.quantity },
                });
            }
        }

        order.status = "cancelled";
        order.cancelledAt = new Date();
        order.cancelledBy = "user";

        await order.save({ validateBeforeSave: false });;

        res.json({ message: "Order cancelled successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Razorpay Order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentMethod === "cod") {
            return res.status(400).json({
                message: "COD does not require payment",
            });
        }

        if (order.isPaid) {
            return res.status(400).json({ message: "Order already paid" });
        }

        if (order.razorpayOrderId && !order.isPaid) {
            return res.json({
                id: order.razorpayOrderId,
                amount: order.totalAmount * 100,
                currency: "INR",
            });
        }

        const options = {
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: `order_${order._id}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        order.razorpayOrderId = razorpayOrder.id;
        await order.save({ validateBeforeSave: false });;

        res.json(razorpayOrder);
    } catch (err) {
        console.error("RAZORPAY ORDER ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// PAYMENT VERIFICATION
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.isPaid) {
            return res.status(400).json({ message: "Order already paid" });
        }

        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ message: "Order mismatch" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;

        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { countInStock: -item.quantity },
            });
        }

        await order.save({ validateBeforeSave: false });;

        res.json({ message: "Payment successful" });
    } catch (err) {
        console.error("VERIFY PAYMENT ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// CANCEL UNPAID ORDERS
// export const autoCancelUnpaidOrders = async () => {
//     try {
//         const now = new Date();

//         const orders = await Order.find({
//             isPaid: false,
//             paymentMethod: { $ne: "cod" },
//             expiresAt: { $lte: now },
//             status: "pending",
//         })
//             .select("_id items")
//             .lean();

//         if (!orders.length) {
//             console.log("No expired orders to cancel");
//             return;
//         }

//         const bulkOps = [];

//         for (const order of orders) {
//             for (const item of order.items) {
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: item.product },
//                         update: {
//                             $inc: { countInStock: item.quantity },
//                         },
//                     },
//                 });
//             }
//         }

//         if (bulkOps.length) {
//             await Product.bulkWrite(bulkOps);
//         }

//         const result = await Order.updateMany(
//             { _id: { $in: orders.map(o => o._id) } },
//             {
//                 $set: {
//                     status: "cancelled",
//                     cancelledBy: "system",
//                     cancelledAt: now,
//                 },
//             }
//         );

//         console.log(
//             `Auto-cancelled ${result.modifiedCount} orders and restored stock`
//         );
//     } catch (err) {
//         console.error("AUTO CANCEL ERROR:", err);
//     }
// };
