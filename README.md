# 📚 Readers Haven - Library Management System

Full-stack library management system with AI-powered book recommendations.

## 🎯 Project Structure

```
D:\ELAI PROJECT\
├── frontend\           Frontend HTML/CSS/JS
│   └── index.html
│
├── backend\            Node.js API Server
│   ├── server.js
│   ├── models\         Database models
│   ├── routes\         API routes
│   └── controllers\    Business logic
│
└── Flowise\            AI Chatbot system
```

## 🚀 Quick Start

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** (for frontend)
- Start **MySQL** (for database)

### 2. Create Database
- Open phpMyAdmin: `http://localhost/phpmyadmin`
- Create database: `readers_haven`
- Run SQL from `backend/scripts/` to create tables

### 3. Start Backend
```bash
cd backend
npm install          # First time only
npm run dev         # Start API server
```
Backend runs on: `http://localhost:5000`

### 4. Open Frontend
- **Live Server:** Right-click `frontend/index.html` → "Open with Live Server"
- **OR XAMPP:** Copy to `C:\xampp\htdocs\` and visit `http://localhost/`

## ✨ Features

- 🔐 User authentication (register/login)
- 📖 Book catalog with 72+ books
- 🔍 Search and filter by genre
- 📚 Borrow and reserve books
- 📅 Due date tracking
- 💰 Overdue fines
- ⭐ Book reviews and ratings
- 🤓 AI Librarian chatbot
- 📱 Responsive design

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Flowise AI Chatbot

**Backend:**
- Node.js + Express
- MySQL (XAMPP)
- JWT Authentication
- Sequelize ORM

## 📄 Documentation

- Frontend: See `frontend/README.md`
- Backend: See `backend/README.md`
- Quick Start: See `backend/QUICK_START.md`

## 🎓 For Development

**Frontend Port:** 5500 (Live Server) or 80 (XAMPP)  
**Backend Port:** 5000  
**Database Port:** 3306 (MySQL)

## 📝 License

MIT

