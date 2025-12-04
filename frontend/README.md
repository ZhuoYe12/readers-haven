# 📚 Readers Haven - Frontend

Beautiful, minimalist library interface with AI-powered book discovery.

## 🚀 Quick Start

### Option 1: Live Server (Easiest)
1. Open `index.html` in VS Code
2. Right-click → "Open with Live Server"
3. Browser opens automatically!

### Option 2: XAMPP
1. Copy `index.html` to `C:\xampp\htdocs\readers-haven\`
2. Start Apache in XAMPP Control Panel
3. Visit: `http://localhost/readers-haven/`

### Option 3: Any Web Server
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx http-server -p 3000
```

## 🔗 Backend Connection

Make sure backend is running on `http://localhost:5000`

Frontend will connect to:
- API: `http://localhost:5000/api`
- Books: `http://localhost:5000/api/books`
- Auth: `http://localhost:5000/api/auth`

## ✨ Features

- 📖 Browse books by 12 genres
- 🔍 Search by title, author, or genre
- 📚 View detailed book information
- 🤓 AI Librarian chatbot (Flowise)
- 📱 Fully responsive design
- 🎨 Clean, minimalist UI

## 🎯 Usage

1. Browse genres by clicking genre cards
2. Click any book to see details
3. Use search bar to find specific books
4. Chat with AI Librarian for recommendations

