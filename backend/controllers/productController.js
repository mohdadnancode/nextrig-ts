import Product from "../models/productModel.js";

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
            limit = 15,
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const hasFilters =
            search ||
            (category && category !== "All") ||
            (brand && brand !== "All") ||
            minPrice ||
            maxPrice ||
            (sort && sort !== "default");

        if (!hasFilters) {
            const products = await Product.aggregate([
                { $match: { isAvailable: true } },
                { $sample: { size: limitNumber } },
            ]);

            const total = await Product.countDocuments({ isAvailable: true });

            return res.json({
                products,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    hasNextPage: true,
                },
            });
        }

        if (search && process.env.ATLAS_SEARCH_INDEX) {
            return getProductsWithAtlasSearch(req, res);
        }

        let query = { isAvailable: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }

        if (category && category !== "All") query.category = category;
        if (brand && brand !== "All") query.brand = brand;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === "low") sortOption = { price: 1 };
        if (sort === "high") sortOption = { price: -1 };

        const total = await Product.countDocuments(query);

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        return res.json({
            products,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                hasNextPage: pageNumber * limitNumber < total,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

async function getProductsWithAtlasSearch(req, res) {
    try {
        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 15,
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const pipeline = [];

        pipeline.push({
            $search: {
                index: process.env.ATLAS_SEARCH_INDEX,
                text: {
                    query: search,
                    path: ["name", "category", "brand"],
                    fuzzy: {},
                },
            },
        });

        const matchStage = {};

        if (category && category !== "All") matchStage.category = category;
        if (brand && brand !== "All") matchStage.brand = brand;

        if (minPrice || maxPrice) {
            matchStage.price = {};
            if (minPrice) matchStage.price.$gte = Number(minPrice);
            if (maxPrice) matchStage.price.$lte = Number(maxPrice);
        }

        if (Object.keys(matchStage).length) {
            pipeline.push({ $match: matchStage });
        }

        let sortOption = { createdAt: -1 };
        if (sort === "low") sortOption = { price: 1 };
        if (sort === "high") sortOption = { price: -1 };

        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $sort: sortOption },
                    { $skip: skip },
                    { $limit: limitNumber },
                ],
            },
        });

        const result = await Product.aggregate(pipeline);

        const total = result[0]?.metadata[0]?.total || 0;
        const products = result[0]?.data || [];

        return res.json({
            products,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                hasNextPage: pageNumber * limitNumber < total,
            },
        });
    } catch (err) {
        console.warn("Atlas failed → fallback:", err.message);
        return getProducts(req, res);
    }
}

export const getProductSuggestions = async (req, res) => {
    try {
        const { q, limit = 5 } = req.query;

        if (!q || !q.trim()) return res.json([]);

        if (process.env.ATLAS_SEARCH_INDEX) {
            const results = await Product.aggregate([
                {
                    $search: {
                        index: process.env.ATLAS_SEARCH_INDEX,
                        autocomplete: {
                            query: q,
                            path: "name",
                            fuzzy: { maxEdits: 1 },
                        },
                    },
                },
                { $limit: Number(limit) },
                {
                    $project: {
                        name: 1,
                        category: 1,
                        brand: 1,
                        images: { $slice: ["$images", 1] },
                    },
                },
            ]);

            return res.json(results);
        }

        // fallback
        const results = await Product.find({
            name: { $regex: q, $options: "i" },
        })
            .select("name category brand images")
            .limit(Number(limit));

        res.json(results);
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
