# 🚀 Backend - How to Run

## ⚡ Quick Start (3 Steps)

### 1. Make Sure XAMPP MySQL is Running
- Open XAMPP Control Panel
- Click **"Start"** next to **MySQL**
- MySQL should show green "Running" status

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

### 3. Verify It's Working
You should see:
```
✅ MySQL Connected: localhost:3306
📊 Database: readers_haven
🚀 Server running on port 5000
```

## ✅ Backend is Ready!

Your API is running at: `http://localhost:5000/api`

Test it in browser:
```
http://localhost:5000/api/health
http://localhost:5000/api/books
```

## 🔧 Configuration

Database settings in `.env` file:
- Host: localhost
- Port: 3306
- Database: readers_haven
- User: root
- Password: (empty)

## 📊 Database Tables

Make sure these exist in phpMyAdmin:
- users
- books
- borrows

## ⚠️ Troubleshooting

**"MySQL Connection Error"**
- Check XAMPP MySQL is running
- Verify database `readers_haven` exists
- Check tables are created

**"Port 5000 already in use"**
- Stop other Node.js processes
- Or change PORT in .env

**"Cannot find module"**
- Run `npm install` first

