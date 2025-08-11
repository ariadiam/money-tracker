const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/:userId/transactions', verifyToken, transactionController.getUserTransactions);

router.post('/:userId/transactions', verifyToken, transactionController.addTransaction);

router.patch('/:userId/transactions/:transactionId', verifyToken, transactionController.updateTransaction);

router.delete('/:userId/transactions/:transactionId', verifyToken, transactionController.deleteTransaction);

router.get('/:userId/transactions/summary', verifyToken, transactionController.getSummary);

// router.get('/', authMiddleware, transactionController.getUserTransactions);

module.exports = router;