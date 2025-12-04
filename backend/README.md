# 📚 Readers Haven - Backend API

Complete Node.js + Express + MongoDB backend for the Readers Haven Library Management System.

## 🚀 Features

- **Authentication & Authorization** - JWT-based user authentication with role-based access control
- **Book Management** - CRUD operations for books with search, filtering, and pagination
- **Borrow System** - Borrow books with automatic due date calculation and overdue tracking
- **Reservation System** - Reserve unavailable books with expiry dates
- **Fine Calculation** - Automatic fine calculation for overdue books
- **User Management** - Admin panel for managing users
- **Reviews & Ratings** - Users can review and rate books
- **RESTful API** - Clean, well-documented API endpoints

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)
  - Local installation OR
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier available)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone or Navigate to Project

```bash
cd "D:\ELAI PROJECT"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy this content to your .env file

# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Choose one:
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/readers-haven

# Option 2: MongoDB Atlas (recommended for production)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/readers-haven

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_please_change_this_in_production_123456789
JWT_EXPIRE=30d

# CORS
CLIENT_URL=http://localhost:3000

# Flowise Integration (your existing config)
FLOWISE_API_URL=https://flowise-c5l3.onrender.com
FLOWISE_CHATFLOW_ID=6eb20e85-fbdf-469e-b138-d2bf76caa1fa
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string and add to `.env`

### 5. Seed Database (Optional)

Populate database with sample books:

```bash
npm run seed
```

### 6. Start Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/updatedetails` | Update user details | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |

### Books

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/books` | Get all books | Public |
| GET | `/api/books/search?q=query` | Search books | Public |
| GET | `/api/books/genre/:genre` | Get books by genre | Public |
| GET | `/api/books/:id` | Get single book | Public |
| POST | `/api/books` | Create book | Librarian/Admin |
| PUT | `/api/books/:id` | Update book | Librarian/Admin |
| DELETE | `/api/books/:id` | Delete book | Admin |
| POST | `/api/books/:id/review` | Add review | Private |

### Borrows & Reservations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/borrows/borrow/:bookId` | Borrow a book | Private |
| POST | `/api/borrows/reserve/:bookId` | Reserve a book | Private |
| PUT | `/api/borrows/return/:borrowId` | Return a book | Private |
| PUT | `/api/borrows/renew/:borrowId` | Renew borrowing | Private |
| DELETE | `/api/borrows/cancel/:borrowId` | Cancel reservation | Private |
| GET | `/api/borrows/my-borrows` | Get my borrowed books | Private |
| GET | `/api/borrows/my-reservations` | Get my reservations | Private |
| GET | `/api/borrows/history` | Get borrowing history | Private |
| GET | `/api/borrows/all` | Get all borrows | Librarian/Admin |
| GET | `/api/borrows/overdue` | Get overdue books | Librarian/Admin |

### Users (Admin)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Librarian/Admin |
| GET | `/api/users/:id` | Get single user | Librarian/Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| GET | `/api/users/:id/borrows` | Get user's borrows | Librarian/Admin |

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```javascript
Authorization: Bearer <your_jwt_token>
```

Example with axios:

```javascript
axios.get('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 👥 User Roles

- **user** - Regular library member (can borrow, reserve, review)
- **librarian** - Library staff (can manage books, view all borrows)
- **admin** - System administrator (full access)

## 📝 Example Requests

### Register User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Borrow Book

```bash
POST http://localhost:5000/api/borrows/borrow/BOOK_ID
Authorization: Bearer YOUR_TOKEN
```

### Search Books

```bash
GET http://localhost:5000/api/books/search?q=harry potter
```

## 🔧 Project Structure

```
readers-haven-backend/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── bookController.js    # Book management logic
│   ├── borrowController.js  # Borrow/reserve logic
│   └── userController.js    # User management logic
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema
│   ├── Book.js              # Book schema
│   └── Borrow.js            # Borrow/Reservation schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── books.js             # Book routes
│   ├── borrows.js           # Borrow routes
│   └── users.js             # User routes
├── scripts/
│   └── seedBooks.js         # Database seeder
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Entry point
└── README.md               # This file
```

## 🌐 Connecting Frontend

Update your `index.html` to use the API:

```javascript
// Example: Fetch books from API
async function fetchBooks() {
  const response = await fetch('http://localhost:5000/api/books');
  const data = await response.json();
  return data.data.books;
}

// Example: Borrow book with authentication
async function borrowBook(bookId, token) {
  const response = await fetch(`http://localhost:5000/api/borrows/borrow/${bookId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
```

## 🚢 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create readers-haven-api

# Add MongoDB Atlas
# (Set MONGODB_URI in Heroku config vars)

# Deploy
git push heroku main
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

## 📊 Database Schema

### User
- name, email, password (hashed)
- role (user/librarian/admin)
- borrowedBooks[], reservedBooks[]
- preferences (favoriteGenres, readingGoal, notifications)

### Book
- title, author, isbn, description
- genres[], coverImage
- quantity, available
- rating (average, count)
- reviews[]

### Borrow
- user, book
- type (borrow/reservation)
- status (active/returned/overdue/cancelled)
- dates (borrow, due, return)
- fine calculation
- renewal tracking

## 🔍 Testing

Test API endpoints using:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- [Insomnia](https://insomnia.rest/)
- cURL

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

**JWT Error**
- Ensure JWT_SECRET is set in `.env`
- Check token format: `Bearer <token>`

**Port Already in Use**
- Change PORT in `.env`
- Kill process: `lsof -ti:5000 | xargs kill` (Mac/Linux)

## 📄 License

MIT

## 👨‍💻 Author

Readers Haven Library System

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

