// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Product from "./models/productModel.js";
// import products from "./data/products.js";

// dotenv.config();

// await mongoose.connect(process.env.MONGO_URI);

// const importData = async () => {
//     try{
//         await Product.deleteMany();
//         await Product.insertMany(products);

//         console.log("Data imported");
//         process.exit();
//     } catch (err) {
//         console.log(err);
//         process.exit(1);
//     }
// };

// importData();