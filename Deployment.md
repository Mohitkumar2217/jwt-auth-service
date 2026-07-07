# 🚀 Deployment Guide

This guide explains how to deploy the backend securely.

---

# 1. Create Environment Variables

```
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=https://yourfrontend.vercel.app

NODE_ENV=production
```

---

# 2. Install Dependencies

```bash
npm install
```

---

# 3. Production Cookie Settings

```javascript
res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
});
```

For local development

```javascript
secure: false
sameSite: "lax"
```

---

# 4. Enable CORS

```javascript
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
```

---

# 5. Cookie Parser

```javascript
app.use(cookieParser());
```

---

# 6. JSON Parser

```javascript
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));
```

---

# 7. MongoDB Connection

```javascript
mongoose.connect(process.env.MONGO_URI);
```

---

# 8. Start Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 9. Deploy to Render

Create a new Web Service.

Build Command

```bash
npm install
```

Start Command

```bash
npm start
```

Environment Variables

```
MONGO_URI

JWT_SECRET

CLIENT_URL

NODE_ENV
```

---

# 10. Deploy Frontend

Recommended

- Vercel
- Netlify

Update API URL

```javascript
const API_URL =
"https://your-backend.onrender.com/api";
```

---

# 11. Enable Cookies

Axios

```javascript
axios.defaults.withCredentials = true;
```

or

```javascript
axios.create({
    baseURL: API_URL,
    withCredentials: true
});
```

---

# 12. Protected Route Flow

```
                             Login
                               │
                               ▼
                         Receive Cookie
                               │
                               ▼
                     Browser Stores Cookie
                               │
                               ▼
                          API Request
                               │
                               ▼
                      Browser Sends Cookie
                               │
                               ▼
                      JWT Verification
                               │
                               ▼
                         Authenticated
```

---

# 13. Security Checklist

- HTTPS Enabled
- Secure Cookies
- HTTP-only Cookies
- Environment Variables
- JWT Secret Hidden
- CORS Configured
- MongoDB Atlas Whitelist Updated
- Passwords Hashed

---

# 14. Production Recommendations

- Use HTTPS
- Use MongoDB Atlas
- Enable Helmet

```bash
npm install helmet
```

```javascript
import helmet from "helmet";

app.use(helmet());
```

- Enable Rate Limiting

```bash
npm install express-rate-limit
```

- Enable Compression

```bash
npm install compression
```

---

# 15. Deployment Checklist

- Environment Variables Added
- MongoDB Connected
- CORS Configured
- Cookies Working
- JWT Working
- Protected Routes Working
- Login Working
- Logout Working
- Profile Working
- Production HTTPS Enabled

---

Happy Deploying 🚀