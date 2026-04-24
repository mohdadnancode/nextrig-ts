// // Run this ONCE to wipe the malformed cart data from MongoDB:
// //   node clearCarts.js
// //
// // After running, users re-add items from the Products page and from
// // that point forward, getMe populates and returns correct CartItem shapes.

// import dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";

// await mongoose.connect(process.env.MONGO_URI);
// const result = await mongoose.connection.collection("users").updateMany(
//   {},
//   { $set: { cart: [], wishlist: [] } }
// );
// console.log(`Cleared cart/wishlist on ${result.modifiedCount} users`);
// await mongoose.disconnect();