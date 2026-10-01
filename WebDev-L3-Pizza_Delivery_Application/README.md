# 🍕 PizzaHub — Full-Stack Pizza Delivery Application

A clean, responsive, production-style MERN Full-Stack Pizza Delivery Application built with React.js, Node.js, Express.js, MongoDB, JWT Authentication, Razorpay Test Mode, Socket.IO, Nodemailer, and node-cron.

---

## 🌟 Key Features

### 👤 Customer Experience
* **Artisanal Home & Menu**: Interactive hero section showcasing fresh wood-fired pizzas with chef-curated varieties (Margherita, Pepperoni Delight, Veggie Supreme).
* **Step-by-Step Pizza Builder**: 4-step wizard with visual progress tracking:
  1. **Base**: Choose 1 of 5 crust options (*Classic, Thin Crust, Cheese Burst, Whole Wheat, Gluten Free*).
  2. **Sauce**: Choose 1 of 5 secret sauces (*Classic Tomato, Spicy Marinara, BBQ, Garlic Cream, Pesto*).
  3. **Cheese**: Choose 1 of 4 premium cheeses (*Mozzarella, Cheddar, Parmesan, Cheese Blend*).
  4. **Vegetables**: Multi-select crisp garden toppings (*Bell Pepper, Onion, Mushroom, Olive, Tomato, Jalapeño, Corn, Spinach*).
* **Live Recipe & Pricing Breakdown**: Sticky sidebar displaying selected ingredients, live subtotal, and total price.
* **Order Summary & Address Entry**: Complete review of the custom recipe, delivery details, and price breakdown.
* **Razorpay Test Payment**: Secure sandbox test payment integration with instant digital verification.
* **Real-Time Order Tracking (`/my-orders`)**: Visual 3-step delivery progress indicator powered by Socket.IO:
  $$\text{Order Received} \longrightarrow \text{In Kitchen} \longrightarrow \text{Sent to Delivery}$$
  Updates dynamically without page refreshes!

### 🛡️ Administrator Experience
* **Dedicated Admin Authentication (`/admin/login`)**: Separate login portal restricted to administrators.
* **Admin Dashboard (`/admin/dashboard`)**: Key operational metrics including:
  * Total Orders
  * Active / Pending Orders
  * Low Stock Alerts
  * Today's Orders
  * Quick links to Inventory & Kitchen Orders
* **Inventory Management (`/admin/inventory`)**:
  * Real-time stock display across all 4 categories (*Bases, Sauces, Cheeses, Vegetables*).
  * Manual stock update input with instant MongoDB sync.
  * Configurable alert thresholds with visual status badges (*In Stock, Low Stock, Out of Stock*).
* **Live Order Dispatch (`/admin/orders`)**:
  * Complete incoming order queue showing customer info, recipe details, totals, and payment status.
  * One-click status advancement (*Order Received $\to$ In Kitchen $\to$ Sent to Delivery*).
  * Emits live Socket.IO events directly updating customers' screens in real time.

### ⚙️ Backend & Automation
* **Automated Stock Deduction**: Deducts 1 unit from each chosen ingredient upon order payment confirmation. Prevents negative stock via atomic database constraints.
* **Stock Availability Validation**: Server validates all ingredients before payment orders can be created.
* **Low Stock Scheduled Monitor**: Automated `node-cron` background worker checks inventory every 30 minutes.
* **Email Services (Nodemailer)**:
  * Account verification emails with activation links.
  * 15-minute expiring password reset emails.
  * Automated low-stock email alerts sent to the store admin.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Lucide Icons, Pure Vanilla CSS |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB (Mongoose ODM) with automated embedded in-memory fallback |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Payment** | Razorpay Test Mode & Sandbox Checkout |
| **Email & Cron** | Nodemailer (with Ethereal Test Email fallback), node-cron |

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js (v18+ recommended)
* npm or yarn

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
# Or start normally:
node server.js
```
The server will start on: **`http://localhost:5000`**

### 2. Start the Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The client will start on: **`http://localhost:5173`**

---

## 🔑 Default Credentials

### Administrator Account
* **URL**: `http://localhost:5173/admin/login`
* **Email**: `admin@pizzahub.test`
* **Password**: `AdminPassword123`

### Customer Account
* Register a new account at `http://localhost:5173/register`
* Click the development quick-verification link to activate instantly.

---

## 📂 Project Architecture

```text
WebDev-L3-Pizza_Delivery_Application/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Dynamic customer/admin navbar
│   │   │   ├── Footer.jsx         # Footer with quick links
│   │   │   └── ProtectedRoute.jsx # Role-based route guard
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing & menu showcase
│   │   │   ├── PizzaBuilder.jsx   # 4-step pizza wizard
│   │   │   ├── OrderSummary.jsx   # Review & Razorpay checkout
│   │   │   ├── MyOrders.jsx       # Real-time order tracker
│   │   │   ├── Login.jsx          # Customer login
│   │   │   ├── Register.jsx       # Customer registration
│   │   │   ├── VerifyEmail.jsx    # Email token verification
│   │   │   ├── ForgotPassword.jsx # Request reset link
│   │   │   ├── ResetPassword.jsx  # Submit new password
│   │   │   ├── AdminLogin.jsx     # Staff login portal
│   │   │   ├── AdminDashboard.jsx # Store metrics overview
│   │   │   ├── AdminInventory.jsx # Stock & threshold control
│   │   │   └── AdminOrders.jsx    # Live kitchen status updater
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state & session sync
│   │   │   ├── PizzaContext.jsx   # Builder state & pricing
│   │   │   └── ToastContext.jsx   # Toast alert notifications
│   │   ├── services/
│   │   │   └── api.js             # Configured Axios client
│   │   ├── App.jsx                # Router & Provider wrapper
│   │   ├── index.css              # Custom PizzaHub design system
│   │   └── main.jsx
│   └── package.json
│
└── server/
    ├── config/
    │   └── db.js                  # MongoDB & MongoMemoryServer connector
    ├── controllers/
    │   ├── adminController.js     # Admin stats, inventory, order updates
    │   ├── authController.js      # Register, verify, login, reset password
    │   ├── orderController.js     # Create order & user orders
    │   ├── paymentController.js   # Razorpay test order & verify signature
    │   └── pizzaController.js     # Curated items & builder options
    ├── jobs/
    │   └── stockMonitor.js        # Scheduled 30-min node-cron check
    ├── middleware/
    │   ├── authMiddleware.js      # JWT authentication guard
    │   └── adminMiddleware.js     # Admin role verification guard
    ├── models/
    │   ├── User.js                # Users collection
    │   ├── Order.js               # Orders collection
    │   └── Inventory.js           # Inventory collection
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── orderRoutes.js
    │   ├── paymentRoutes.js
    │   └── pizzaRoutes.js
    ├── services/
    │   ├── emailService.js        # Nodemailer email dispatcher
    │   └── inventoryService.js    # Stock validation & deduction
    ├── seedAdmin.js               # Initial ingredients & admin seeder
    ├── socket.js                  # Socket.IO initialization
    ├── server.js                  # Express entry point
    └── package.json
```
