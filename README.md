# 📚 Readers Haven Library System

AI-powered library management system with book discovery, borrowing, and intelligent recommendations.

## 🌐 Live Demo

**Frontend:** [https://readers-haven-phi.vercel.app](https://readers-haven-phi.vercel.app)  
**Backend API:** [https://readers-haven-vmav.onrender.com](https://readers-haven-vmav.onrender.com)

## ✨ Features

- 📖 **Browse 21+ Books** across multiple genres (Mystery, Sci-Fi, Fantasy, Romance, etc.)
- 🤖 **AI Librarian Chatbot** powered by Flowise for book recommendations
- 👤 **User Authentication** with JWT (Sign up, Login, Profile management)
- 📚 **Borrow & Reserve Books** with due date tracking
- 📊 **My Library Dashboard** to track borrowed books, reservations, and history
- 🔍 **Advanced Search** by title, author, or genre
- 📱 **Responsive Design** works on desktop, tablet, and mobile
- 🎨 **Minimalist UI** with clean, modern interface

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Deployed on **Vercel**

### Backend
- Node.js + Express.js
- MySQL with Sequelize ORM
- JWT Authentication
- RESTful API
- Deployed on **Render**

### Database
- MySQL hosted on **Railway**
- 21 books with full metadata
- User accounts with encrypted passwords
- Borrowing and reservation tracking

### AI Chatbot
- **Flowise** AI chatbot
- Book recommendations and library assistance
- Natural language interaction

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MySQL database
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZhuoYe12/readers-haven.git
   cd readers-haven
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   Create `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost
   
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_NAME=railway
   DB_USER=root
   DB_PASSWORD=your-password
   
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=30d
   ```

4. **Import Database**
   ```bash
   # Run this in your MySQL database
   mysql -u root -p < backend/railway-complete-import.sql
   ```

5. **Start Backend**
   ```bash
   npm run dev
   ```

6. **Start Frontend**
   - Open `frontend/index.html` in your browser
   - Or serve via XAMPP, Live Server, or any static file server

## 📁 Project Structure

```
readers-haven/
├── frontend/
│   └── index.html          # Main frontend application
├── backend/
│   ├── server.js           # Express server
│   ├── config/
│   │   └── database.js     # Database connection
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Utility scripts
│   └── all-books.sql       # Database seed data
├── .gitignore
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/genre/:genre` - Get books by genre
- `GET /api/books/search?q=query` - Search books
- `GET /api/books/:id` - Get single book

### Borrowing
- `POST /api/borrows/borrow/:bookId` - Borrow a book (protected)
- `POST /api/borrows/reserve/:bookId` - Reserve a book (protected)
- `POST /api/borrows/return/:borrowId` - Return a book (protected)
- `GET /api/borrows/my-borrows` - Get user's borrowed books (protected)
- `GET /api/borrows/my-reservations` - Get user's reservations (protected)
- `GET /api/borrows/history` - Get borrowing history (protected)

## 🎨 Screenshots

*Add your screenshots here*

## 📝 Database Schema

### Users
- `id`, `name`, `email`, `password`, `role`, `created_at`

### Books
- `id`, `title`, `author`, `description`, `genres`, `cover_image`, `quantity`, `available`, `rating_average`, `rating_count`, `created_at`

### Borrows
- `id`, `user_id`, `book_id`, `borrow_type`, `borrow_date`, `due_date`, `return_date`, `status`, `created_at`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 👨‍💻 Author

**Christian Dhave Salazar**  
- GitHub: [@ZhuoYe12](https://github.com/ZhuoYe12)

## 🙏 Acknowledgments

- Flowise for the AI chatbot platform
- Unsplash for book cover images
- Railway for MySQL hosting
- Render for backend hosting
- Vercel for frontend hosting

---

⭐ **Star this repo if you find it helpful!**
