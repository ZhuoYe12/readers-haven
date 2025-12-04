const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize, connectDB } = require('./config/database');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://readers-haven-phi.vercel.app',
  'http://localhost',
  'http://localhost:80',
  'http://127.0.0.1'
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database connection
connectDB();

// Essential API Routes
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const [existingUsers] = await sequelize.query(
      'SELECT * FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    await sequelize.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      { replacements: [name, email, hashedPassword, 'user'] }
    );
    
    // Get the created user
    const [users] = await sequelize.query(
      'SELECT id, name, email, role FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    const user = users[0];
    const token = generateToken(user.id);
    
    res.status(201).json({
      status: 'success',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user
    const [users] = await sequelize.query(
      'SELECT * FROM users WHERE email = ?',
      { replacements: [email] }
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    const user = users[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    const token = generateToken(user.id);
    
    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await sequelize.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      { replacements: [decoded.id] }
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { user: users[0] }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Not authorized'
    });
  }
});

// Borrow book
app.post('/api/borrows/borrow/:bookId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Please login to borrow books'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const bookId = req.params.bookId;
    
    // Get book
    const [books] = await sequelize.query(
      'SELECT * FROM books WHERE id = ?',
      { replacements: [bookId] }
    );
    
    if (books.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }
    
    const book = books[0];
    
    if (book.available < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Book is currently not available'
      });
    }
    
    // Calculate due date (14 days)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    // Create borrow record
    await sequelize.query(
      'INSERT INTO borrows (user_id, book_id, type, status, borrow_date, due_date) VALUES (?, ?, ?, ?, NOW(), ?)',
      { replacements: [userId, bookId, 'borrow', 'active', dueDate] }
    );
    
    // Update book availability
    await sequelize.query(
      'UPDATE books SET available = available - 1 WHERE id = ?',
      { replacements: [bookId] }
    );
    
    res.status(201).json({
      status: 'success',
      message: `Successfully borrowed "${book.title}". Due date: ${dueDate.toLocaleDateString()}`
    });
  } catch (error) {
    console.error('Borrow error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Reserve book
app.post('/api/borrows/reserve/:bookId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Please login to reserve books'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const bookId = req.params.bookId;
    
    // Get book
    const [books] = await sequelize.query(
      'SELECT * FROM books WHERE id = ?',
      { replacements: [bookId] }
    );
    
    if (books.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }
    
    const book = books[0];
    
    // Calculate expiry date (7 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    // Create reservation
    await sequelize.query(
      'INSERT INTO borrows (user_id, book_id, type, status, borrow_date, due_date) VALUES (?, ?, ?, ?, NOW(), ?)',
      { replacements: [userId, bookId, 'reservation', 'active', expiryDate] }
    );
    
    res.status(201).json({
      status: 'success',
      message: `Successfully reserved "${book.title}". Reservation expires: ${expiryDate.toLocaleDateString()}`
    });
  } catch (error) {
    console.error('Reserve error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Get my borrows
app.get('/api/borrows/my-borrows', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [borrows] = await sequelize.query(
      `SELECT b.*, bk.title, bk.author, bk.cover_image 
       FROM borrows b 
       JOIN books bk ON b.book_id = bk.id 
       WHERE b.user_id = ? AND b.type = 'borrow' AND b.status IN ('active', 'overdue')
       ORDER BY b.borrow_date DESC`,
      { replacements: [decoded.id] }
    );
    
    res.json({
      status: 'success',
      data: {
        borrows: borrows.map(b => ({
          ...b,
          book: { title: b.title, author: b.author, cover_image: b.cover_image }
        })),
        count: borrows.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Get my reservations
app.get('/api/borrows/my-reservations', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [reservations] = await sequelize.query(
      `SELECT b.*, bk.title, bk.author, bk.cover_image 
       FROM borrows b 
       JOIN books bk ON b.book_id = bk.id 
       WHERE b.user_id = ? AND b.type = 'reservation' AND b.status = 'active'
       ORDER BY b.borrow_date DESC`,
      { replacements: [decoded.id] }
    );
    
    res.json({
      status: 'success',
      data: {
        reservations: reservations.map(r => ({
          ...r,
          reservationExpiryDate: r.due_date,
          book: { title: r.title, author: r.author, cover_image: r.cover_image }
        })),
        count: reservations.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Return borrowed book
app.put('/api/borrows/return/:borrowId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const borrowId = req.params.borrowId;
    
    // Get borrow record
    const [borrows] = await sequelize.query(
      'SELECT * FROM borrows WHERE id = ? AND user_id = ?',
      { replacements: [borrowId, decoded.id] }
    );
    
    if (borrows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Borrow record not found'
      });
    }
    
    const borrow = borrows[0];
    
    if (borrow.status === 'returned') {
      return res.status(400).json({
        status: 'error',
        message: 'Book has already been returned'
      });
    }
    
    // Update borrow record
    await sequelize.query(
      'UPDATE borrows SET status = ?, return_date = NOW() WHERE id = ?',
      { replacements: ['returned', borrowId] }
    );
    
    // Increase book availability
    await sequelize.query(
      'UPDATE books SET available = available + 1 WHERE id = ?',
      { replacements: [borrow.book_id] }
    );
    
    // Get book title
    const [books] = await sequelize.query(
      'SELECT title FROM books WHERE id = ?',
      { replacements: [borrow.book_id] }
    );
    
    res.json({
      status: 'success',
      message: `"${books[0].title}" has been returned successfully!`
    });
  } catch (error) {
    console.error('Return error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Get borrow history
app.get('/api/borrows/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [history] = await sequelize.query(
      `SELECT b.*, bk.title, bk.author, bk.cover_image 
       FROM borrows b 
       JOIN books bk ON b.book_id = bk.id 
       WHERE b.user_id = ? AND b.type = 'borrow'
       ORDER BY b.borrow_date DESC
       LIMIT 50`,
      { replacements: [decoded.id] }
    );
    
    res.json({
      status: 'success',
      data: {
        history: history.map(h => ({
          ...h,
          borrowDate: h.borrow_date,
          book: { title: h.title, author: h.author, cover_image: h.cover_image }
        })),
        count: history.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const [books] = await sequelize.query('SELECT * FROM books ORDER BY created_at DESC LIMIT 50');
    res.json({
      status: 'success',
      data: { books, count: books.length }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get books by genre
app.get('/api/books/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const [books] = await sequelize.query(
      `SELECT * FROM books WHERE JSON_CONTAINS(genres, '"${genre}"') ORDER BY created_at DESC`,
    );
    res.json({
      status: 'success',
      data: { books, count: books.length, genre }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Search books
app.get('/api/books/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query required'
      });
    }
    const [books] = await sequelize.query(
      `SELECT * FROM books WHERE title LIKE ? OR author LIKE ? LIMIT 20`,
      { replacements: [`%${q}%`, `%${q}%`] }
    );
    res.json({
      status: 'success',
      data: { books, count: books.length }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get single book
app.get('/api/books/:id', async (req, res) => {
  try {
    const [books] = await sequelize.query(
      'SELECT * FROM books WHERE id = ?',
      { replacements: [req.params.id] }
    );
    if (books.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }
    res.json({
      status: 'success',
      data: { book: books[0] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Readers Haven API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

module.exports = app;

