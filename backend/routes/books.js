const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookController = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const bookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('genres').isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive number')
];

// @route   GET /api/books
// @desc    Get all books with filtering, pagination
// @access  Public
router.get('/', bookController.getBooks);

// @route   GET /api/books/search
// @desc    Search books by title, author, genre
// @access  Public
router.get('/search', bookController.searchBooks);

// @route   GET /api/books/genre/:genre
// @desc    Get books by genre
// @access  Public
router.get('/genre/:genre', bookController.getBooksByGenre);

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', bookController.getBook);

// @route   POST /api/books
// @desc    Create new book
// @access  Private (Librarian/Admin)
router.post('/', protect, authorize('librarian', 'admin'), bookValidation, bookController.createBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (Librarian/Admin)
router.put('/:id', protect, authorize('librarian', 'admin'), bookController.updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), bookController.deleteBook);

// @route   POST /api/books/:id/review
// @desc    Add book review
// @access  Private
router.post('/:id/review', protect, bookController.addReview);

module.exports = router;

