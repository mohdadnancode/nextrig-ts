import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const getProductMeta = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        const brands = await Product.distinct("brand");

        res.json({
            categories: ["All", ...categories],
            brands: ["All", ...brands],
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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
            limit = 10,
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const hasFilters =
            (search && search.trim()) ||
            (category && category !== "All") ||
            (brand && brand !== "All") ||
            minPrice ||
            maxPrice ||
            (sort && sort !== "default");

        if (!hasFilters) {
            const total = await Product.countDocuments({ isAvailable: true });

            const products = await Product.find({ isAvailable: true })
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limitNumber);

            const totalPages = Math.ceil(total / limitNumber);

            return res.json({
                products,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    pages: totalPages,
                    hasNextPage: pageNumber < totalPages,
                },
            });
        }

        if (search && process.env.ATLAS_SEARCH_INDEX && !req.skipAtlasSearch) {
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

        const totalPages = Math.ceil(total / limitNumber);

        return res.json({
            products,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                pages: totalPages,
                hasNextPage: pageNumber < totalPages,
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

        const matchStage = { isAvailable: true };

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

        const totalPages = Math.ceil(total / limitNumber);

        return res.json({
            products,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                pages: totalPages,
                hasNextPage: pageNumber < totalPages,
            },
        });
    } catch (err) {
        console.warn("Atlas failed -> fallback:", err.message);
        req.skipAtlasSearch = true;
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
        const existing = await Product.findOne({
            name: { $regex: `^${req.body.name}$`, $options: "i" },
        });

        if (existing) {
            return res.status(400).json({
                message: "Product with this name already exists",
            });
        }

        const uploads = await Promise.all(
            (req.files || []).map(file => uploadToCloudinary(file.buffer))
        );

        const images = uploads.map(img => ({
            url: img.secure_url,
            public_id: img.public_id,
        }));

        const product = await Product.create({
            ...req.body,
            countInStock: Number(req.body.countInStock),
            images: images,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addProductImages = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const uploads = await Promise.all(
            (req.files || []).map(file => uploadToCloudinary(file.buffer))
        );

        const newImages = uploads.map(img => ({
            url: img.secure_url,
            public_id: img.public_id,
        }));

        product.images = [...product.images, ...newImages];

        await product.save();

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { public_id } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // delete from cloudinary
        await cloudinary.uploader.destroy(public_id);

        // remove from DB
        product.images = product.images.filter(
            (img) => img.public_id !== public_id
        );

        await product.save();

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const duplicate = await Product.findOne({
            _id: { $ne: req.params.id },
            name: { $regex: `^${req.body.name}$`, $options: "i" },
        });

        if (duplicate) {
            return res.status(400).json({
                message: "Another product with this name already exists",
            });
        }

        const existing = await Product.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({ message: "Product not found" });
        }

        // handle images
        const uploads = await Promise.all(
            (req.files || []).map(file => uploadToCloudinary(file.buffer))
        );

        const newImages = uploads.map(img => ({
            url: img.secure_url,
            public_id: img.public_id,
        }));

        if (newImages.length > 0) {
            existing.images = [...existing.images, ...newImages];
        }

        // update fields
        if (req.body.name !== undefined) existing.name = req.body.name;
        if (req.body.brand !== undefined) existing.brand = req.body.brand;
        if (req.body.category !== undefined) existing.category = req.body.category;
        if (req.body.price !== undefined) existing.price = Number(req.body.price);
        if (req.body.countInStock !== undefined) existing.countInStock = Number(req.body.countInStock);
        if (req.body.description !== undefined) existing.description = req.body.description;
        existing.featured = req.body.featured === "true";

        await existing.save();

        res.json(existing);
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

        await Promise.all(
            (product.images || []).map(img =>
                cloudinary.uploader.destroy(img.public_id)
            )
        );
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
