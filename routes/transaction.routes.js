const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// Get all transactions for a user
router.get('/:userId/transactions', transactionController.getUserTransactions);

// Add a new transaction
router.post('/:userId/transactions', transactionController.addTransaction);

// Delete a transaction
router.delete('/:userId/transactions/:transactionId', transactionController.deleteTransaction);

// Get financial summary
router.get('/:userId/transactions/summary', transactionController.getSummary);

module.exports = router;