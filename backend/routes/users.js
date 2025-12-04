const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin/librarian role

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Librarian/Admin)
router.get('/', protect, authorize('librarian', 'admin'), userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (Librarian/Admin)
router.get('/:id', protect, authorize('librarian', 'admin'), userController.getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

// @route   GET /api/users/:id/borrows
// @desc    Get user's borrowed books
// @access  Private (Librarian/Admin)
router.get('/:id/borrows', protect, authorize('librarian', 'admin'), userController.getUserBorrows);

module.exports = router;

