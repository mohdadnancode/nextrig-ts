import Product from "../models/productModel.js"

export const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 15
        } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } }
            ];
        }

        if (category && category !== "All") {
            query.category = category;
        }

        if (brand && brand !== "All") {
            query.brand = brand;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const pageNumber = Number(page);
        const limitedNumber = Number(limit);
        const skip = (pageNumber - 1) * limitedNumber;

        const totalProducts = await Product.countDocuments(query);

        let sortOption = { createdAt: -1 };
        if (sort === "low") sortOption = { price: 1 };
        if (sort === "high") sortOption = { price: -1 };

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitedNumber);

        res.json({
            products,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalProducts / limitedNumber),
                totalProducts,
                hasNextPage: pageNumber < Math.ceil(totalProducts / limitedNumber),
                hasPrevPage: pageNumber > 1
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};