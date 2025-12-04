const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  type: {
    type: String,
    enum: ['borrow', 'reservation'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue', 'cancelled', 'fulfilled'],
    default: 'active'
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: function() {
      return this.type === 'borrow';
    }
  },
  returnDate: {
    type: Date
  },
  reservationDate: {
    type: Date,
    default: function() {
      return this.type === 'reservation' ? Date.now() : null;
    }
  },
  reservationExpiryDate: {
    type: Date,
    required: function() {
      return this.type === 'reservation';
    }
  },
  fine: {
    amount: {
      type: Number,
      default: 0
    },
    paid: {
      type: Boolean,
      default: false
    }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  renewalCount: {
    type: Number,
    default: 0,
    max: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate fine for overdue books
borrowSchema.methods.calculateFine = function() {
  if (this.type !== 'borrow' || this.status === 'returned') {
    return 0;
  }
  
  const today = new Date();
  if (today > this.dueDate) {
    const daysOverdue = Math.ceil((today - this.dueDate) / (1000 * 60 * 60 * 24));
    const finePerDay = 0.50; // $0.50 per day
    return daysOverdue * finePerDay;
  }
  return 0;
};

// Check if overdue
borrowSchema.methods.isOverdue = function() {
  if (this.type !== 'borrow' || this.status === 'returned') {
    return false;
  }
  return new Date() > this.dueDate;
};

// Update status before saving
borrowSchema.pre('save', function(next) {
  if (this.type === 'borrow' && this.status === 'active' && this.isOverdue()) {
    this.status = 'overdue';
    this.fine.amount = this.calculateFine();
  }
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
borrowSchema.index({ user: 1, book: 1, status: 1 });
borrowSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('Borrow', borrowSchema);

