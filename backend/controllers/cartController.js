import User from "../models/userModel.js";


// Get Cart
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("cart.product");

        const cart = user.cart
            .map(item => {
                if (!item.product) return null;

                return {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.images?.[0] || "",
                    quantity: item.quantity,
                    stock: item.product.countInStock,
                    category: item.product.category
                };
            })
            .filter(Boolean);

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID required" });
        }

        const user = await User.findById(req.user._id);

        const existingItem = user.cart.find(
            item =>
                item.product &&
                item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();

        res.json({ message: "Item added to cart" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update Quantity
export const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const user = await User.findById(req.user._id);

        const item = user.cart.find(
            item => item.product && item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.quantity = quantity;

        await user.save();

        res.json({ message: "Cart updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Remove Item
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart = user.cart.filter(
            item => item.product && item.product.toString() !== productId
        );

        await user.save();

        res.json({ message: "Item removed" });
    } catch (err) {
        console.error("REMOVE CART ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};


// Clear Cart
export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.cart = [];

        await user.save();

        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};