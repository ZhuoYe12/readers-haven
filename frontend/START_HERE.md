# 🌐 Frontend - How to Run

## ⚡ Quick Start

### Option 1: Live Server (Recommended)
1. Open `index.html` in VS Code
2. Right-click → **"Open with Live Server"**  
3. Done! 🎉

### Option 2: XAMPP Apache
1. Start **Apache** in XAMPP Control Panel
2. Copy `index.html` to `C:\xampp\htdocs\readers-haven\`
3. Visit: `http://localhost/readers-haven/`

### Option 3: Simple HTTP Server
```bash
# In frontend folder
npx http-server -p 3000

# Visit: http://localhost:3000
```

## ✅ What You'll See

- Library homepage
- Search bar
- 12 genre categories
- Book browsing
- AI Librarian chatbot (bottom-right)

## 🔗 Backend Required

Frontend connects to backend API at:
```
http://localhost:5000/api
```

**Make sure backend is running first!**

## 📱 Features

- Browse by genre
- Search books
- View book details
- Login/Signup
- Borrow books (requires login)
- Chat with AI Librarian

## ⚠️ Troubleshooting

**"Unable to connect to server"**
- Start backend first (`cd backend && npm run dev`)
- Backend must run on port 5000

**Books not showing**
- Check browser console (F12)
- Verify backend is running
- Check network tab for errors

