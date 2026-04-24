import User from "../models/userModel.js";

// GET wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");

        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// TOGGLE wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const user = await User.findById(req.user._id);

        const exists = user.wishlist.some(
            (id) => id.toString() === productId
        );

        if (exists) {
            user.wishlist = user.wishlist.filter(
                (id) => id.toString() !== productId
            );
        } else {
            user.wishlist.push(productId);
        }

        await user.save();

        res.json({ message: "Wishlist updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CLEAR wishlist
export const clearWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist = [];
        await user.save();

        res.json({ message: "Wishlist cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};