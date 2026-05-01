import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

const ORDER_FLOW = {
    pending: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
};

// Admin Dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const range = req.query.range || "30D";

        const now = new Date();

        const daysMap = { "365D": 365, "30D": 30, "7D": 7, "1D": 1 };
        let fromDate = null;

        if (daysMap[range]) {
            fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - daysMap[range]);
        }

        // COUNTS 
        const [userCount, productCount] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
        ]);

        // AGGREGATION 
        const stats = await Order.aggregate([
            { $match: { isPaid: true } }, // lifetime paid

            {
                $facet: {
                    // TOTAL REVENUE (lifetime)
                    totalRevenue: [
                        {
                            $group: {
                                _id: null,
                                revenue: { $sum: "$totalAmount" },
                                count: { $sum: 1 },
                            },
                        },
                    ],

                    // RANGE DATA (chart)
                    chartData: [
                        ...(fromDate ? [{ $match: { createdAt: { $gte: fromDate } } }] : []),
                        {
                            $group: {
                                _id:
                                    range === "365D" || range === "overall"
                                        ? {
                                            year: { $year: "$createdAt" },
                                            month: { $month: "$createdAt" },
                                        }
                                        : {
                                            date: {
                                                $dateToString: {
                                                    format: "%Y-%m-%d",
                                                    date: "$createdAt",
                                                },
                                            },
                                        },
                                revenue: { $sum: "$totalAmount" },
                                orders: { $sum: 1 },
                            },
                        },
                        { $sort: { "_id": 1 } },
                    ],

                    // RECENT ORDERS
                    recentOrders: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 8 },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                        { $unwind: "$user" },
                        {
                            $project: {
                                _id: 1,
                                totalAmount: 1,
                                status: 1,
                                paymentMethod: 1,
                                isPaid: 1,
                                createdAt: 1,
                                customerName: "$user.username",
                                customerEmail: "$user.email",
                                itemCount: { $size: "$items" },
                            },
                        },
                    ],
                },
            },
        ]);

        const totalRevenue = stats[0]?.totalRevenue[0]?.revenue || 0;
        const totalOrders = stats[0]?.totalRevenue[0]?.count || 0;

        // FORMAT CHART 
        const chartRaw = stats[0]?.chartData || [];

        const formatLabel = (item) => {
            if (item._id.year) {
                return new Date(item._id.year, item._id.month - 1).toLocaleDateString(
                    "en-IN",
                    { month: "short", year: "numeric" }
                );
            }
            return new Date(item._id.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
            });
        };

        const revenueChart = chartRaw.map((i) => ({
            date: formatLabel(i),
            revenue: i.revenue,
        }));

        const ordersChart = chartRaw.map((i) => ({
            date: formatLabel(i),
            orders: i.orders,
        }));

        // STATUS COUNTS 
        const statusCountsRaw = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const statusCounts = {
            pending: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };

        statusCountsRaw.forEach((s) => {
            statusCounts[s._id] = s.count;
        });

        res.json({
            users: userCount,
            products: productCount,
            orders: totalOrders,
            revenue: totalRevenue,
            recentOrders: stats[0]?.recentOrders || [],
            revenueChart,
            ordersChart,
            statusCounts,
        });
    } catch (err) {
        console.error("DASHBOARD ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get Orders
export const getAllOrders = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 5, 50);

        const rawSearch = req.query.search?.trim() || "";
        const search = rawSearch.replace("#", "").toUpperCase();

        const status = req.query.status || "all";
        const sort = req.query.sort || "newest";

        const matchStage = {};
        if (status !== "all") {
            matchStage.status = status;
        }

        const sortStage =
            sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const isObjectId =
            mongoose.Types.ObjectId.isValid(search) &&
            new mongoose.Types.ObjectId(search).toString() === search;

        const isHex = /^[a-fA-F0-9]{4,24}$/.test(search);

        const pipeline = [
            { $match: matchStage },

            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },

            ...(search
                ? isObjectId
                    ? [
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(search),
                            },
                        },
                    ]
                    : [
                        {
                            $addFields: {
                                idStr: { $toString: "$_id" },
                            },
                        },
                        {
                            $match: {
                                $or: [
                                    {
                                        orderNumber: {
                                            $regex: search,
                                            $options: "i",
                                        },
                                    },

                                    ...(isHex
                                        ? [
                                            {
                                                idStr: {
                                                    $regex: search,
                                                    $options: "i",
                                                },
                                            },
                                        ]
                                        : []),

                                    {
                                        "user.username": {
                                            $regex: search,
                                            $options: "i",
                                        },
                                    },
                                    {
                                        "user.email": {
                                            $regex: search,
                                            $options: "i",
                                        },
                                    },
                                ],
                            },
                        },
                    ]
                : []),

            { $sort: sortStage },

            {
                $facet: {
                    orders: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];

        const result = await Order.aggregate(pipeline);

        const orders = result[0]?.orders || [];
        const total = result[0]?.totalCount[0]?.count || 0;

        res.json({
            orders,
            page,
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (err) {
        console.error("ORDER FETCH ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const currentStatus = order.status;
        const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        if (status === currentStatus) {
            return res.status(400).json({ message: "Order already in this status" });
        }
        if (!ORDER_FLOW[currentStatus].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from ${currentStatus} to ${status}`,
            });
        }

        if (status === "cancelled" && currentStatus === "pending") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { countInStock: item.quantity },
                });
            }
            order.cancelledAt = new Date();
            order.cancelledBy = "admin";
        }

        if (status === "shipped") order.shippedAt = new Date();

        if (status === "delivered") {
            order.deliveredAt = new Date();
            if (order.paymentMethod === "cod" && !order.isPaid) {
                order.isPaid = true;
                order.paidAt = new Date();
            }
        }

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        console.error("STATUS UPDATE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get users
export const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 10, 50); // max 50
        const search = req.query.search?.trim() || "";

        const matchStage = search
            ? {
                $match: {
                    $or: [
                        { username: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                    ],
                },
            }
            : null;

        const pipeline = [
            ...(matchStage ? [matchStage] : []),

            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "user",
                    as: "orders",
                },
            },

            {
                $addFields: {
                    orderCount: { $size: "$orders" },
                    totalSpent: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$orders",
                                        as: "o",
                                        cond: { $eq: ["$$o.isPaid", true] },
                                    },
                                },
                                as: "o",
                                in: "$$o.totalAmount",
                            },
                        },
                    },
                },
            },

            {
                $project: {
                    password: 0,
                    orders: 0,
                },
            },

            { $sort: { createdAt: -1 } },

            {
                $facet: {
                    users: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];

        const result = await User.aggregate(pipeline);

        const users = result[0]?.users || [];
        const total = result[0]?.totalCount[0]?.count || 0;

        res.json({
            users,
            page,
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Block toggle
export const toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("role isBlocked username");
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot block an admin user" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            isBlocked: user.isBlocked,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};