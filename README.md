<div align="center">

# ⚡ NextRig

### Full-Stack PC Hardware E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

A modern, production-ready PC hardware e-commerce platform built with the MERN stack — featuring secure JWT authentication, Razorpay payment integration, a rich admin dashboard, full order lifecycle management, and automated inventory handling.

</div>

---

## 📸 Overview

NextRig delivers a seamless hardware shopping experience with real-time inventory tracking, multi-gateway payments, and a powerful admin control center — all wrapped in a fully responsive UI.

---

## ✨ Features

### 👤 User Experience

| Feature | Description |
|---|---|
| 🔐 Auth & Verification | Register, login with Email OTP verification & JWT-protected routes |
| 🛍️ Shopping | Browse products by category, search, wishlist, cart & Buy Now |
| 💳 Payments | Razorpay online payments + Cash on Delivery with dynamic fees |
| 📦 Orders | Place, track, and cancel orders with real-time status updates |
| 📍 Addresses | Save and manage multiple delivery addresses |
| 📱 Responsive | Fully responsive design across all devices |

### 🛠️ Admin Control Center

| Feature | Description |
|---|---|
| 📊 Dashboard | Revenue stats, user counts, product totals, order overviews |
| 📦 Products | Add, edit, delete products with multi-image Cloudinary uploads |
| 👥 Users | View, block, and unblock users |
| 🗂️ Orders | Search, filter, sort, paginate and update order statuses |
| 📈 Inventory | Real-time stock monitoring and management |

### ⚡ Advanced Capabilities

- **Automated Order Expiry** — Unpaid online orders auto-cancel after 15 minutes via `node-cron`
- **Automatic Stock Restoration** — Cancelled/expired orders restore inventory instantly
- **Debounced Search** — Admin orders searchable by Order ID, Username, or Email
- **Server-side Pagination** — Optimized MongoDB aggregation for large datasets
- **Dynamic Shipping Logic** — Smart shipping charges + COD fee calculation
- **Razorpay Signature Verification** — Secure payment validation on every transaction

---

## 🔄 Order Lifecycle

```
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
       ┌─────────┐              ┌───────────┐
       │ SHIPPED │              │ CANCELLED │
       └────┬────┘              └───────────┘
            │
            ▼
      ┌───────────┐
      │ DELIVERED │
      └───────────┘
```

**Online Payment Orders**
- Created as `pending`
- Auto-expire after **15 minutes** if unpaid
- Stock is restored automatically on expiry/cancellation

**COD Orders**
- No expiry timer
- COD handling fee applied at checkout
- Payment collected on delivery

---

## 🏗️ Tech Stack

### Frontend
```
React  ·  TypeScript  ·  Tailwind CSS  ·  React Router DOM
Axios  ·  React Hot Toast  ·  Lucide React
```

### Backend
```
Node.js  ·  Express.js  ·  MongoDB  ·  Mongoose
JWT  ·  Bcrypt  ·  Redis  ·  Node Cron  ·  Razorpay SDK  ·  Cloudinary
```

---

## 📂 Project Structure

```
NextRig/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── utils/
│   └── public/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
│
└── README.md
```

---

## 🔐 Authentication Flow

```
User Registers
      │
      ▼
OTP Sent to Email
      │
      ▼
User Verifies OTP
      │
      ▼
JWT Token Issued
      │
      ▼
Protected Routes Unlocked
```

---

## 💳 Payment System

### 🌐 Online Payment (Razorpay)
1. Razorpay order generated on checkout
2. User completes payment via Razorpay UI
3. Signature verified server-side
4. Order marked as paid → Stock deducted

### 📦 Cash on Delivery
1. COD fee added dynamically
2. Order placed without online verification
3. Payment collected at the door

---

## ⏱️ Auto-Cancel System

Unpaid online payment orders expire automatically after **15 minutes**.

```
Order Created (pending)
        │
    [15 min]
        │
        ▼
   expiresAt reached?
        │
   node-cron checks ──► MongoDB query ──► Auto-cancel + Stock restored
```

---

## 📊 Admin Dashboard

The dashboard gives a real-time snapshot of your store:

- 👥 **Total Users** registered on the platform
- 📦 **Total Products** listed across all categories
- 🗂️ **Total Orders** with status breakdown
- 💰 **Revenue Statistics** with order value tracking

---

## 🔍 Order Search & Filtering

The admin orders panel supports powerful filtering:

- 🔎 Search by **Order ID**, **Username**, or **Email**
- 🗂️ **Status Filtering** (Pending / Shipped / Delivered / Cancelled)
- 🔃 **Multi-column Sorting**
- 📄 **Server-side Pagination**

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB
- Redis
- Razorpay Account
- Cloudinary Account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nextrig.git
cd nextrig

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Run the App

```bash
# Start backend
cd backend
node server.js

# Start frontend
cd frontend
npm run dev
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ using the MERN Stack
</div>
