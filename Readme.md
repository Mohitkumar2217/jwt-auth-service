# 🔐 JWT Authentication & Role-Based Authorization System

A production-ready authentication and authorization system built using **Node.js**, **Express.js**, **MongoDB**, and **JWT**. It supports secure authentication using **HTTP-only Cookies**, Role-Based Access Control (RBAC), and protected API routes.

---

## ✨ Features

- User Registration
- User Login
- Password Hashing (bcrypt)
- JWT Authentication
- HTTP-only Secure Cookies
- Role-Based Authorization
- Protected Routes
- User Profile API
- Logout
- MongoDB Integration
- Cookie Authentication
- CORS Support
- Environment Variable Configuration
- Production Ready Structure

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- dotenv
- cors

---

## 📁 Project Structure

```
backend
│
├── config/
│     └── db.js
│
├── controllers/
│     └── authController.js
│
├── middleware/ 
│     └── auth.js
│
├── models/
|     ├── BlacklistSchema.js
│     └── User.js
│
├── routes/
|     ├── profile.js
│     └── authRoutes.js
│
├── .env
├── server.js
└── package.json
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Mohitkumar2217/jwt-auth-service.git
```

Go inside project

```bash
cd jwt-auth-service
```

Install dependencies

```bash
npm install
```

---

## ⚙ Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

NODE_ENV=development

CLIENT_URL=http://localhost:5173
```

---

## ▶ Running the Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## 🔑 Authentication Flow

```
                        Register
                           │
                           ▼
                    Create Account
                           │
                           ▼
                         Login
                           │
                           ▼
                    Verify Password
                           │
                           ▼
                      Generate JWT
                           │
                           ▼
                Store HTTP-only Cookie
                           │
                           ▼
                     Protected APIs
                           │
                           ▼
                   JWT Verification
                           │
                           ▼
                      Authorized
```

---

## 🔒 Roles

```
Admin

Manager

Warehouse

Staff
```

---

## 📌 API Endpoints

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Logout

```
POST /api/auth/logout
```

### User Profile

```
GET /api/auth/profile
```

Protected Route

---

## 🍪 Cookie Authentication

JWT is stored inside an HTTP-only Cookie.

Advantages

- Cannot be accessed by JavaScript
- Protection against XSS attacks
- Automatic authentication
- Better security than LocalStorage

---

## 🔐 Password Security

Passwords are hashed using

```
bcryptjs
```

with generated salt before storing into MongoDB.

---

## 🧩 Role Based Authorization

Supported roles

- Admin
- Manager
- Warehouse
- Staff

Example

```javascript
router.get(
    "/admin",
    auth,
    authorize("admin"),
    controller
);
```

---

## 📬 Sample Login Request

```json
{
    "email": "admin@gmail.com",
    "password": "123456"
}
```

---

## 📬 Sample Response

```json
{
    "success": true,
    "user": {
        "id": "...",
        "name": "Mohit",
        "email": "admin@gmail.com",
        "role": "admin"
    }
}
```

---

## 📦 Dependencies

```
express
mongoose
jsonwebtoken
bcryptjs
cookie-parser
cors
dotenv
nodemon
```

---

## 🛡 Security Features

- JWT Authentication
- HTTP-only Cookies
- Password Hashing
- Role-Based Access
- Environment Variables
- Secure Cookie Support
- Protected APIs

---

## 📄 License

This project is licensed under the MIT License.