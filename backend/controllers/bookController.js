const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// @desc    Get all books with filtering and pagination
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by genre
    if (req.query.genre) {
      query.genres = { $in: [req.query.genre] };
    }

    // Filter by availability
    if (req.query.available === 'true') {
      query.available = { $gt: 0 };
    }

    // Execute query
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Book.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        books,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { genres: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      status: 'success',
      data: {
        books,
        count: books.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get books by genre
// @route   GET /api/books/genre/:genre
// @access  Public
exports.getBooksByGenre = async (req, res) => {
  try {
    const books = await Book.find({
      genres: { $in: [req.params.genre] }
    }).sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        books,
        count: books.length,
        genre: req.params.genre
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    res.json({
      status: 'success',
      data: { book }
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Librarian/Admin)
exports.createBook = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    // Set available to quantity initially
    const bookData = {
      ...req.body,
      available: req.body.quantity,
      addedBy: req.user.id
    };

    const book = await Book.create(bookData);

    res.status(201).json({
      status: 'success',
      data: { book }
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Book with this ISBN already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian/Admin)
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      status: 'success',
      data: { book }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    await book.deleteOne();

    res.json({
      status: 'success',
      data: {},
      message: 'Book deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Add book review
// @route   POST /api/books/:id/review
// @access  Private
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a rating between 1 and 5'
    });
  }

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = book.reviews.find(
      r => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this book'
      });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };

    book.reviews.push(review);

    // Update rating
    book.rating.count = book.reviews.length;
    book.rating.average =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save();

    res.status(201).json({
      status: 'success',
      data: { book },
      message: 'Review added successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

