const User = require('../models/User');
const Borrow = require('../models/Borrow');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Librarian/Admin)
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments();

    res.json({
      status: 'success',
      data: {
        users,
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

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Librarian/Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('borrowedBooks.book', 'title author coverImage')
      .populate('reservedBooks.book', 'title author coverImage');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if user has active borrows
    const activeBorrows = await Borrow.countDocuments({
      user: user._id,
      type: 'borrow',
      status: { $in: ['active', 'overdue'] }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete user with active book borrows'
      });
    }

    await user.deleteOne();

    res.json({
      status: 'success',
      data: {},
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get user's borrowed books
// @route   GET /api/users/:id/borrows
// @access  Private (Librarian/Admin)
exports.getUserBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({
      user: req.params.id
    })
      .populate('book', 'title author coverImage')
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

