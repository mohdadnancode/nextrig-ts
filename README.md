NextRig

A full-stack modern PC hardware e-commerce platform built using the MERN stack with secure authentication, Razorpay payment integration, admin dashboard, order lifecycle management, inventory handling, and responsive UI.

🚀 Features


👤 User Features
User Registration & Login
Email OTP Verification
JWT Authentication
Protected Routes
Browse Products
Product Categories & Search
Wishlist System
Shopping Cart
Buy Now Feature
Address Management
Razorpay Online Payments
Cash on Delivery (COD)
Order Placement
Order Tracking
Order Cancellation
Responsive UI

🛠 Admin Features
Admin Authentication
Dashboard Analytics
Product Management
Add Product
Edit Product
Delete Product
Upload Multiple Images
User Management
Block / Unblock Users
Order Management
View Orders
Search Orders
Filter Orders
Sort Orders
Pagination
Update Order Status
Inventory Management
Revenue Monitoring


⚡ Advanced Features
Secure JWT Authentication
OTP Verification using Email
Razorpay Payment Gateway Integration
Automatic Failed Payment Cancellation
Automatic Stock Restoration
Server-side Pagination
Debounced Search
Search by Order ID / Username / Email
Dynamic Shipping Charges
COD Extra Fee Logic
Optimized MongoDB Aggregation Queries
Clean Admin Dashboard UI
Fully Responsive Design


🧠 Order Lifecycle System
Pending → Shipped → Delivered
        ↘ Cancelled
        
Online Payment Orders
Created as pending
Expires automatically after 15 minutes if unpaid
Auto-cancelled using cron jobs
Stock restored automatically
COD Orders
No expiry timer
Extra COD handling fee applied


🏗 Tech Stack
Frontend
React
TypeScript
Tailwind CSS
React Router DOM
Axios
React Hot Toast
Lucide React
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
Bcrypt
Redis
Node Cron
Razorpay SDK
Cloudinary


📂 Project Structure
NextRig/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── ...
│
└── README.md


🔐 Authentication Flow
User registers
OTP sent to email
User verifies OTP
JWT token generated
Protected routes accessible


💳 Payment System
Online Payment
Razorpay order generated
Payment verified using signature verification
Order marked as paid
Stock reduced after successful payment
COD
No online verification
COD fee added
Payment marked on delivery


📦 Inventory Management
Stock validation before order creation
Automatic stock reduction after successful purchase
Automatic stock restoration on cancellation
Handles expired unpaid orders


🔄 Auto Cancel System

Unpaid online payment orders automatically expire after 15 minutes.

Implemented using:

expiresAt
node-cron
MongoDB queries
Automatic stock recovery


📊 Admin Dashboard

Includes:

Total Users
Total Products
Total Orders
Revenue Statistics
Order Status Overview


🔎 Search & Filtering

Admin Orders Page supports:

Search by Order ID
Search by Username
Search by Email
Status Filtering
Sorting
Pagination