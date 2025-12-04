const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

// Helper function to calculate due date (14 days from now)
const calculateDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date;
};

// Helper function to calculate reservation expiry (7 days from now)
const calculateReservationExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};

// @desc    Borrow a book
// @route   POST /api/borrows/borrow/:bookId
// @access  Private
exports.borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    // Check if book is available
    if (book.available < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Book is currently not available'
      });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await Borrow.findOne({
      user: req.user.id,
      book: book._id,
      type: 'borrow',
      status: { $in: ['active', 'overdue'] }
    });

    if (existingBorrow) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already borrowed this book'
      });
    }

    // Check borrow limit (max 5 books)
    const activeborrows = await Borrow.countDocuments({
      user: req.user.id,
      type: 'borrow',
      status: { $in: ['active', 'overdue'] }
    });

    if (activeborrows >= 5) {
      return res.status(400).json({
        status: 'error',
        message: 'You have reached the maximum borrow limit of 5 books'
      });
    }

    // Create borrow record
    const borrow = await Borrow.create({
      user: req.user.id,
      book: book._id,
      type: 'borrow',
      status: 'active',
      borrowDate: new Date(),
      dueDate: calculateDueDate()
    });

    // Decrease book availability
    book.available -= 1;
    await book.save();

    // Populate book details
    await borrow.populate('book', 'title author coverImage');

    res.status(201).json({
      status: 'success',
      data: { borrow },
      message: `Successfully borrowed "${book.title}". Due date: ${borrow.dueDate.toLocaleDateString()}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Reserve a book
// @route   POST /api/borrows/reserve/:bookId
// @access  Private
exports.reserveBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found'
      });
    }

    // Check if user already has a reservation for this book
    const existingReservation = await Borrow.findOne({
      user: req.user.id,
      book: book._id,
      type: 'reservation',
      status: 'active'
    });

    if (existingReservation) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reserved this book'
      });
    }

    // Create reservation
    const reservation = await Borrow.create({
      user: req.user.id,
      book: book._id,
      type: 'reservation',
      status: 'active',
      reservationDate: new Date(),
      reservationExpiryDate: calculateReservationExpiry()
    });

    await reservation.populate('book', 'title author coverImage');

    res.status(201).json({
      status: 'success',
      data: { reservation },
      message: `Successfully reserved "${book.title}". Reservation expires: ${reservation.reservationExpiryDate.toLocaleDateString()}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Return a borrowed book
// @route   PUT /api/borrows/return/:borrowId
// @access  Private
exports.returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId).populate('book');

    if (!borrow) {
      return res.status(404).json({
        status: 'error',
        message: 'Borrow record not found'
      });
    }

    // Check if user owns this borrow
    if (borrow.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to return this book'
      });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({
        status: 'error',
        message: 'Book has already been returned'
      });
    }

    // Update borrow record
    borrow.status = 'returned';
    borrow.returnDate = new Date();

    // Calculate fine if overdue
    if (borrow.isOverdue()) {
      borrow.fine.amount = borrow.calculateFine();
    }

    await borrow.save();

    // Increase book availability
    const book = await Book.findById(borrow.book);
    book.available += 1;
    await book.save();

    res.json({
      status: 'success',
      data: { borrow },
      message: borrow.fine.amount > 0
        ? `Book returned. Fine due: $${borrow.fine.amount.toFixed(2)}`
        : 'Book returned successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Renew a borrowed book
// @route   PUT /api/borrows/renew/:borrowId
// @access  Private
exports.renewBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId).populate('book');

    if (!borrow) {
      return res.status(404).json({
        status: 'error',
        message: 'Borrow record not found'
      });
    }

    // Check if user owns this borrow
    if (borrow.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to renew this book'
      });
    }

    // Check renewal limit
    if (borrow.renewalCount >= 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Maximum renewal limit (3) reached'
      });
    }

    // Check if overdue
    if (borrow.isOverdue()) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot renew overdue books. Please return and pay fines first.'
      });
    }

    // Extend due date by 14 days
    const currentDueDate = new Date(borrow.dueDate);
    currentDueDate.setDate(currentDueDate.getDate() + 14);
    borrow.dueDate = currentDueDate;
    borrow.renewalCount += 1;

    await borrow.save();

    res.json({
      status: 'success',
      data: { borrow },
      message: `Book renewed successfully. New due date: ${borrow.dueDate.toLocaleDateString()}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Cancel a reservation
// @route   DELETE /api/borrows/cancel/:borrowId
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Borrow.findById(req.params.borrowId);

    if (!reservation) {
      return res.status(404).json({
        status: 'error',
        message: 'Reservation not found'
      });
    }

    // Check if user owns this reservation
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this reservation'
      });
    }

    if (reservation.type !== 'reservation') {
      return res.status(400).json({
        status: 'error',
        message: 'This is not a reservation'
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      status: 'success',
      data: {},
      message: 'Reservation cancelled successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get current user's borrowed books
// @route   GET /api/borrows/my-borrows
// @access  Private
exports.getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      user: req.user.id,
      type: 'borrow',
      status: { $in: ['active', 'overdue'] }
    })
      .populate('book', 'title author coverImage genres')
      .sort({ borrowDate: -1 });

    res.json({
      status: 'success',
      data: {
        borrows,
        count: borrows.length
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

// @desc    Get current user's reservations
// @route   GET /api/borrows/my-reservations
// @access  Private
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Borrow.find({
      user: req.user.id,
      type: 'reservation',
      status: 'active'
    })
      .populate('book', 'title author coverImage genres')
      .sort({ reservationDate: -1 });

    res.json({
      status: 'success',
      data: {
        reservations,
        count: reservations.length
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

// @desc    Get user's borrowing history
// @route   GET /api/borrows/history
// @access  Private
exports.getBorrowHistory = async (req, res) => {
  try {
    const history = await Borrow.find({
      user: req.user.id,
      type: 'borrow'
    })
      .populate('book', 'title author coverImage')
      .sort({ borrowDate: -1 })
      .limit(50);

    res.json({
      status: 'success',
      data: {
        history,
        count: history.length
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

// @desc    Get all borrows (admin/librarian)
// @route   GET /api/borrows/all
// @access  Private (Librarian/Admin)
exports.getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate('user', 'name email')
      .populate('book', 'title author')
      .sort({ borrowDate: -1 })
      .limit(100);

    res.json({
      status: 'success',
      data: {
        borrows,
        count: borrows.length
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

// @desc    Get overdue books
// @route   GET /api/borrows/overdue
// @access  Private (Librarian/Admin)
exports.getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await Borrow.find({
      type: 'borrow',
      status: { $in: ['active', 'overdue'] },
      dueDate: { $lt: new Date() }
    })
      .populate('user', 'name email')
      .populate('book', 'title author')
      .sort({ dueDate: 1 });

    // Update status and calculate fines
    for (let borrow of overdueBooks) {
      if (borrow.status === 'active') {
        borrow.status = 'overdue';
        borrow.fine.amount = borrow.calculateFine();
        await borrow.save();
      }
    }

    res.json({
      status: 'success',
      data: {
        overdueBooks,
        count: overdueBooks.length
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

