# 🧾 Recipe World - Server Side (Express + MongoDB + Firebase Auth)

This is the backend of the **Recipe World** project — built with Node.js and Express.js. It provides API endpoints for managing and delivering recipe data securely, with Firebase authentication integration.

---

## 🌐 Live Site (Client)

👉 Frontend Repo: [https://github.com/mehedi-vai-coder/Recipe-Client-Side](https://github.com/mehedi-vai-coder/Recipe-Client-Side)  
👉 Live Site: [https://recipe-auth-328a6.web.app](https://recipe-auth-328a6.web.app)

---

## ⚙️ Features

- 🔒 Firebase Admin SDK Token Verification (for protected API access)
- 📤 RESTful APIs for recipe data
- 🗃️ MongoDB for storing recipe & chef info
- ⚡ Secure & lightweight Express server
- 🔁 CORS enabled for frontend integration
- 📁 Environment variables used for security

---

## 🛠️ Tech Stack

| Server     | Database | Auth          | Tools      |
|------------|----------|---------------|------------|
| Node.js    | MongoDB  | Firebase Auth | Express.js |
| Firebase Admin SDK | | dotenv      | CORS        |

---

## 📁 API Endpoints

| Method | Endpoint          | Description                      |
|--------|-------------------|----------------------------------|
| GET    | `/recipes`        | Get all recipes                  |
| GET    | `/recipes/:id`    | Get recipe details by ID         |
| POST   | `/verify-token`   | Verify Firebase user token       |

🔐 Protected routes require valid Firebase ID token sent via `Authorization` header.

---

## 🧪 Setup Locally

### Step 1: Clone the Repository
```bash
git clone https://github.com/mehedi-vai-coder/Recipe-Server-Side.git
cd Recipe-Server-Side

🧠 What I Learned
Firebase token verification with Express middleware

Structuring backend APIs with security in mind

Using MongoDB for flexible data storage

Working with environment variables for secure config

📬 Contact Me
📧 Email: md.mehedihasan27bd@gmail.com

💻 GitHub: https://github.com/mehedi-vai-coder
