const Transaction = require('../models/transaction.model');
const mongoose = require('mongoose');

async function getByUserId(userId, { limit = 50, skip = 0 } = {}) {
  return await Transaction.find({ user: userId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}

async function create(userId, transactionData) {
  if (transactionData.amount != null) {
    transactionData.amount = Math.abs(Number(transactionData.amount));
  }
  if (transactionData.category) {
    transactionData.category = String(transactionData.category).trim();
  }
  if (transactionData.type && !['income', 'expense'].includes(transactionData.type)) {
    throw new Error('Invalid type: must be "income" or "expense"');
  }

  const transaction = new Transaction({
    user: userId,
    ...transactionData,
    date: transactionData.date || new Date()
  });

  try {
    return await transaction.save();
  } catch (error) {
    throw new Error(`Error creating transaction: ${error.message}`);
  }
}

async function update(transactionId, userId, updateData) {
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

  if (updates.amount != null) {
    updates.amount = Math.abs(Number(updates.amount));
  }
  if (updates.category) {
    updates.category = String(updates.category).trim();
  }
  if (updates.type && !['income', 'expense'].includes(updates.type)) {
    throw new Error('Invalid type: must be "income" or "expense"');
  }
 
  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, user: userId },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedTransaction) {
    throw new Error('Transaction not found or unauthorized');
  }

  return updatedTransaction;
}

async function deleteById(transactionId, userId) {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new Error('Invalid transaction ID');
  }
  return await Transaction.findOneAndDelete({ _id: transactionId, user: userId });
}

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
  update,
  deleteById,
  getSummary
};