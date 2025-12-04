const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/borrows/borrow/:bookId
// @desc    Borrow a book
// @access  Private
router.post('/borrow/:bookId', protect, borrowController.borrowBook);

// @route   POST /api/borrows/reserve/:bookId
// @desc    Reserve a book
// @access  Private
router.post('/reserve/:bookId', protect, borrowController.reserveBook);

// @route   PUT /api/borrows/return/:borrowId
// @desc    Return a borrowed book
// @access  Private
router.put('/return/:borrowId', protect, borrowController.returnBook);

// @route   PUT /api/borrows/renew/:borrowId
// @desc    Renew a borrowed book
// @access  Private
router.put('/renew/:borrowId', protect, borrowController.renewBook);

// @route   DELETE /api/borrows/cancel/:borrowId
// @desc    Cancel a reservation
// @access  Private
router.delete('/cancel/:borrowId', protect, borrowController.cancelReservation);

// @route   GET /api/borrows/my-borrows
// @desc    Get current user's borrowed books
// @access  Private
router.get('/my-borrows', protect, borrowController.getMyBorrows);

// @route   GET /api/borrows/my-reservations
// @desc    Get current user's reservations
// @access  Private
router.get('/my-reservations', protect, borrowController.getMyReservations);

// @route   GET /api/borrows/history
// @desc    Get user's borrowing history
// @access  Private
router.get('/history', protect, borrowController.getBorrowHistory);

// @route   GET /api/borrows/all
// @desc    Get all borrows (admin/librarian)
// @access  Private (Librarian/Admin)
router.get('/all', protect, authorize('librarian', 'admin'), borrowController.getAllBorrows);

// @route   GET /api/borrows/overdue
// @desc    Get overdue books
// @access  Private (Librarian/Admin)
router.get('/overdue', protect, authorize('librarian', 'admin'), borrowController.getOverdueBooks);

module.exports = router;

