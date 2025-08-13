const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, transactionController.getUserTransactions);
router.post('/', verifyToken, transactionController.addTransaction);
router.patch('/:transactionId', verifyToken, transactionController.updateTransaction);
router.delete('/:transactionId', verifyToken, transactionController.deleteTransaction);
router.get('/summary', verifyToken, transactionController.getSummary);

module.exports = router;
