# SMRI Shop - Backend API

SMRI Shop is a **scalable, secure, and high-performance backend** for a modern full-stack e-commerce platform. It is built with **Node.js**, **Express.js**, and **MongoDB**, and deployed on **Vercel**.

---

## 🚀 Features

- **🛡️ Secure Authentication** - Uses **JWT authentication** for user security.
- **🛒 Order Management** - Users can place, track, and manage orders seamlessly.
- **💰 Payment Integration** - Integrated with **Stripe** for secure transactions.
- **📊 Admin & Seller Dashboard** - Role-based access for managing products and users.
- **📡 RESTful API** - Well-structured endpoints for smooth frontend integration.
- **⚡ High Performance** - Optimized database queries for better response time .
- **💰MongoDB** - aggregation pipelines.

---

## ⚙️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT (JSON Web Token)
- **Payment Gateway:** Stripe
- **Environment Variables:** dotenv
- **Security & Middleware:** CORS, Cookie-Parser
- **Deployment:** Vercel

---

## 🌐 Live API URL

🔗 **Base API URL:** [https://smri-server.vercel.app](https://smri-server.vercel.app)

---

## 📂 Project Structure

```
smri_server/
│-- node_modules/
│-- connection/
│   ├── db.js  # MongoDB connection setup
│-- controllers/
│   ├── all controller heare  # Handles authentication
│-- routes/
│   ├── routes.js  # Authentication routes
│-- .env  # Environment variables
│-- index.js  # Entry point
│-- package.json  # Dependencies and scripts
```

---

## 🔧 Installation & Setup

### 📌 Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or cloud-based)

### 🔻 Clone the Repository

```sh
git clone https://github.com/your-repo/smri-server.git
cd smri-server
```

### 📦 Install Dependencies

```sh
npm install
# or
yarn install
```

### 🔑 Setup Environment Variables

Create a `.env` file in the root directory and add the following values:

```env
DB_URI=<your mongoDB Uri
DB_USER= mongousername
DB_PASS= mongoPass
STRIPE_SECRET_KEY=your stripe secret key
ACCESS_TOKEN_SECRET=make access token
```

### ▶️ Run the Development Server

```sh
npm start
```

The server will start at `http://localhost:5000`.

---

## 🚀 Deployment

### ☁️ Deploy to Vercel

Ensure you have **Vercel CLI** installed and logged in:

```sh
vercel
```
then

```sh
vercel --prod
```

---

## 📂 Git Ignore File

Ensure sensitive files and unnecessary logs are ignored by adding the following to `.gitignore`:

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*

# Dependencies
node_modules
.env

# Editor directories and files
.vscode/
.idea
.DS_Store
```

---
## 👥 Contributors

- [Md Sabbir Mridha](https://github.com/S8374)

---

## 📧 Contact

For support or inquiries, contact us at **[support@smrishop.com](mailto\:sabbirmridha880@gmail.com)**.

---

Now you're all set to **run, develop, and deploy** the **SMRI Shop Backend!** 🚀🔥



