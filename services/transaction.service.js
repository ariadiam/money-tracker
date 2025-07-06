const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');

/**
 * Get all transactions for a user (sorted by date, newest first)
 */
async function getByUserId(userId) {
  return await Transaction.find({ user: userId })
    .sort({ date: -1 })
    .exec();
}

/**
 * Create a new transaction for a user
 */
async function create(userId, transactionData) {
  const transaction = new Transaction({
    user: userId,
    ...transactionData,
    // Ensure date is set (defaults to now if not provided)
    date: transactionData.date || new Date() 
  });
  return await transaction.save();
}

/** 
 * Update a transaction by ID (only if it belongs to the user)
 */
exports.update = async (transactionId, userId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new Error('Invalid transaction ID');
  }

  const allowedUpdates = ['amount', 'type', 'category', 'description', 'date'];
  const updates = {};
  for (const key in updateData) {
    if (allowedUpdates.includes(key)) {
      updates[key] = updateData[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No valid fields provided for update');
  }

  const updatedTransaction = await Transaction.findOneAndUpdate(
    {
      _id: transactionId,
      user: userId  
    },
    updates,
    { new: true, runValidators: true }  
  );

  if (!updatedTransaction) {
    throw new Error('Transaction not found or unauthorized');
  }

  return updatedTransaction;
};

/**
 * Delete a transaction by ID (only if it belongs to the user)
 */
async function deleteById(transactionId, userId) {
  return await Transaction.findOneAndDelete({
    _id: transactionId,
    user: userId // Ensures users can only delete their own transactions
  });
}

/**
 * Get financial summary (income, expense, balance) for a user
 */
async function getSummary(userId) {
  const result = await Transaction.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    }
  ]);

  // Format the result
  const summary = {
    income: result.find(item => item._id === 'income')?.total || 0,
    expense: result.find(item => item._id === 'expense')?.total || 0,
    transactionCount: result.reduce((sum, item) => sum + item.count, 0)
  };
  summary.balance = summary.income - summary.expense;

  return summary;
}

module.exports = {
  getByUserId,
  create,
  deleteById,
  getSummary
};