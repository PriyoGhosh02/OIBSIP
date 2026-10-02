# 🍕 PizzaHub — Full-Stack Pizza Delivery Application

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://onlinepizzadeliverystore.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Sandbox-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)

> 🌐 **Live Website URL**: **[https://onlinepizzadeliverystore.vercel.app/](https://onlinepizzadeliverystore.vercel.app/)**  
> 🛡️ **Live Admin Portal**: **[https://onlinepizzadeliverystore.vercel.app/admin/login](https://onlinepizzadeliverystore.vercel.app/admin/login)**

A production-grade, responsive **MERN Full-Stack Pizza Delivery Application** featuring an interactive 4-step custom pizza builder, secure JWT authentication, Razorpay test payment integration, real-time live order tracking via Socket.IO, automated inventory stock management with low-stock alerts, and an administrator dispatch control dashboard.

---

## 🔑 Default Login Credentials

| Role | Portal URL | Email | Password |
| :--- | :--- | :--- | :--- |
| 👑 **Store Admin** | [Admin Login](https://onlinepizzadeliverystore.vercel.app/admin/login) | `admin@pizzahub.test` | `AdminPassword123` |
| 👤 **Customer** | [Customer Register](https://onlinepizzadeliverystore.vercel.app/register) / [Login](https://onlinepizzadeliverystore.vercel.app/login) | *(Create any free account)* | *(At least 6 characters)* |

> [!NOTE]
> When registering a new customer account, an activation email or development quick-verification link is automatically provided for instant verification.

---

## 🌟 Key Features

### 👤 Customer Experience
* **Artisanal Menu & Hero Section**: Visually appealing showcase with signature chef creations (*Margherita, Pepperoni Delight, Veggie Supreme*).
* **Interactive 4-Step Pizza Builder**:
  1. **Crust Selection**: 5 artisanal crusts (*Classic Hand-Tossed, Thin Crust, Cheese Burst, Whole Wheat, Gluten Free*).
  2. **Sauce Selection**: 5 freshly prepared sauces (*Classic Tomato, Spicy Marinara, BBQ, Garlic Cream, Basil Pesto*).
  3. **Cheese Selection**: 4 premium cheeses (*Mozzarella, Aged Cheddar, Shaved Parmesan, Four-Cheese Blend*).
  4. **Garden Vegetables**: Multi-select crisp fresh toppings (*Bell Pepper, Red Onion, Mushroom, Black Olive, Roma Tomato, Pickled Jalapeño, Sweet Corn, Baby Spinach*).
* **Live Dynamic Price Calculator**: Real-time receipt breakdown computing ingredients, taxes, delivery fee, and live subtotal.
* **Seamless Checkout & Address Entry**: Validated delivery address and phone entry with full order summary review.
* **Razorpay Test Payment Gateway**: Seamless modal test payment supporting Card, UPI, and Netbanking sandbox transactions with instant cryptographic HMAC-SHA256 signature verification.
* **Real-Time Live Order Tracker (`/my-orders`)**:
  * Visual 3-stage delivery progress pipeline:
    $$\text{Order Received} \longrightarrow \text{In Kitchen} \longrightarrow \text{Sent to Delivery}$$
  * Dynamically updates in real-time via Socket.IO events and automatic serverless sync.

---

### 🛡️ Administrator Operations
* **Dedicated Staff Gateway (`/admin/login`)**: Isolated authentication portal restricted to administrators.
* **Operational Metrics Dashboard (`/admin/dashboard`)**:
  * Total Orders Count
  * Active & In-Kitchen Orders
  * Real-time Low Stock Warnings
  * Today's Revenue and Quick Action links
* **Real-Time Inventory Manager (`/admin/inventory`)**:
  * Complete ingredient stock visibility across all 4 categories.
  * Instant inline stock update modal synced to MongoDB.
  * Dynamic threshold status badges: `In Stock` (Green), `Low Stock` (Amber), and `Out of Stock` (Red).
* **Live Kitchen Dispatch Queue (`/admin/orders`)**:
  * Live incoming orders queue with recipe breakdown, customer contact, and delivery address.
  * One-click status progression (*Order Received $\to$ In Kitchen $\to$ Sent to Delivery*).
  * Emits live Socket.IO events that update the customer's tracking screen instantly without refreshing.

---

### ⚙️ Automated Backend Systems
* **Atomic Stock Deduction**: Automatically deducts 1 unit of each selected ingredient upon payment confirmation with atomic database guards to prevent negative inventory.
* **Pre-Checkout Stock Validation**: The server validates ingredient stock before generating a Razorpay order, preventing orders for out-of-stock items.
* **Scheduled Inventory Monitor**: Background `node-cron` worker monitors stock levels and triggers alerts.
* **Email Notification System (Nodemailer)**:
  * Customer email verification tokens.
  * 15-minute expiring password reset tokens.
  * Automated low-stock email alerts sent directly to the store administrator.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 19, Vite, React Router v7, Lucide Icons, Modern Vanilla CSS |
| **Backend API** | Node.js, Express.js (REST API, Serverless-ready) |
| **Real-Time** | Socket.IO (Client & Server) with Polling Auto-Sync Fallback |
| **Database** | MongoDB Atlas (Mongoose ODM) with embedded MongoMemoryServer fallback |
| **Authentication** | JWT (JSON Web Tokens) with HttpOnly cookies & bcryptjs password hashing |
| **Payment Gateway** | Razorpay Test / Sandbox Mode with SHA-256 HMAC verification |
| **Automation** | Nodemailer (with Ethereal Test Email fallback) & node-cron |
| **Deployment** | Vercel Multi-Services (Unified single-domain routing) |

---

## 🚀 Local Development Setup

### 1. Prerequisites
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* **MongoDB** (Cloud MongoDB Atlas URI or local MongoDB)

---

### 2. Clone the Repository
```bash
git clone https://github.com/PriyoGhosh02/OIBSIP.git
cd OIBSIP/WebDev-L3-Pizza_Delivery_Application
```

---

### 3. Setup Backend Server
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=admin@pizzahub.test
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# Server will run on: http://localhost:5000
```

---

### 4. Setup Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
# Client will run on: http://localhost:5173
```

The frontend Vite dev server automatically proxies `/api` requests directly to `http://localhost:5000`.

---

## ☁️ Vercel Deployment Architecture

This project is deployed on **Vercel** using the **Multi-Service Architecture** defined in [`vercel.json`](./vercel.json):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "client": {
      "root": "client",
      "framework": "vite"
    },
    "server": {
      "root": "server",
      "framework": "express",
      "bindings": [
        {
          "type": "service",
          "service": "client",
          "format": "url",
          "env": "CLIENT_URL"
        }
      ]
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": {
        "service": "server"
      }
    },
    {
      "source": "/(.*)",
      "destination": {
        "service": "client"
      }
    }
  ]
}
```

* **Single Domain**: Both Client and Server operate under `https://onlinepizzadeliverystore.vercel.app/` without cross-origin or CORS issues.
* **Unified Routing**: Requests to `/api/*` route to the Express backend; all other routes load the React SPA.
* **Automatic Bindings**: Vercel injects the client's URL into `CLIENT_URL` so email links resolve correctly in production.

---

## 📂 Project Structure

```text
WebDev-L3-Pizza_Delivery_Application/
├── vercel.json                 # Vercel Multi-Services configuration
├── README.md                   # Project documentation
│
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext, PizzaContext, ToastContext
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page & chef specials
│   │   │   ├── PizzaBuilder.jsx   # 4-step wizard
│   │   │   ├── OrderSummary.jsx   # Checkout & Razorpay
│   │   │   ├── MyOrders.jsx       # Real-time tracking
│   │   │   ├── Login.jsx / Register.jsx
│   │   │   ├── AdminLogin.jsx     # Admin authentication
│   │   │   ├── AdminDashboard.jsx # Analytics & overview
│   │   │   ├── AdminInventory.jsx # Stock management
│   │   │   └── AdminOrders.jsx    # Kitchen dispatch
│   │   ├── services/           # Axios API service client
│   │   ├── App.jsx             # Routes & layout wrapper
│   │   └── index.css           # PizzaHub design system
│   └── package.json
│
└── server/                     # Backend Application (Node.js + Express)
    ├── config/db.js            # MongoDB Atlas connection handler
    ├── controllers/            # Auth, Order, Payment, Pizza, Admin controllers
    ├── jobs/stockMonitor.js    # Scheduled cron stock watcher
    ├── middleware/             # JWT auth & admin guards
    ├── models/                 # User, Order, Inventory schemas
    ├── routes/                 # Express API routes
    ├── services/               # Email & inventory services
    ├── seedAdmin.js            # Initial ingredients & admin seeder
    ├── socket.js               # Socket.IO real-time hub
    ├── server.js               # Server entry point
    └── package.json
```

---

## 👨‍💻 Author & Internship Information

* **Project**: Level 3 — Pizza Delivery Application
* **Internship**: Oasis Infobyte Web Development Internship (**OIBSIP**)
* **Developer**: **Priyo Ghosh** ([@PriyoGhosh02](https://github.com/PriyoGhosh02))
* **Live Demo**: [https://onlinepizzadeliverystore.vercel.app/](https://onlinepizzadeliverystore.vercel.app/)
