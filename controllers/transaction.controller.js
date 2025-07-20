const transactionService = require('../services/transaction.service');
const logger = require('../logger/logger');

// Get all transactions for a user
exports.getUserTransactions = async (req, res) => {
  const userId = req.params.userId;
  logger.info(`Fetching all transactions for user ID: ${userId}`);

  try {
    const transactions = await transactionService.getByUserId(req.params.userId);
    logger.info(`Successfully retrieved ${transactions.length} transactions for user ID: ${userId}`);
    res.status(200).json({
      status: true,
      data: transactions,
      message: "Transactions retrieved successfully"
    });
  } catch (err) {
    logger.error(`Error retrieving transactions for user ID: ${userId}`, { error: err });
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in retrieving transactions"
    });
  }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
  const userId = req.params.userId;
   logger.info(`Adding new transaction for user ID: ${userId}`, { transactionData: req.body });

  try {
    const transaction = await transactionService.create(
      req.params.userId,
      req.body
    );
    logger.info(`Transaction created successfully for user ID: ${userId}`, { transactionId: transaction._id });
    res.status(201).json({
      status: true,
      data: transaction,
      message: "Transaction added successfully"
    });
  } catch (err) {
    logger.error(`Error adding transaction for user ID: ${userId}`, { error: err });
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in adding transaction"
    });
  }
};

exports.updateTransaction = async (req, res) => {
   const { transactionId, userId } = req.params;
  logger.info(`Updating transaction ID: ${transactionId} for user ID: ${userId}`);

  try {
    const updatedTransaction = await transactionService.update(
      req.params.transactionId,
      req.params.userId,
      req.body
    );
    logger.info(`Transaction ${transactionId} updated for user ID: ${userId}`);
    res.status(200).json({ 
      status: true, 
      data: updatedTransaction,
      message: "Transaction updated successfully" 
    });
  } catch (err) {
    logger.error(`Error updating transaction ID: ${transactionId} for user ID: ${userId}`, { error: err });
    res.status(400).json({ 
      status: false, 
      data: null,
      message: "Error in updating transaction"
    });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { transactionId, userId } = req.params;
  logger.info(`Deleting transaction ID: ${transactionId} for user ID: ${userId}`);

  try {
    await transactionService.deleteById(
      req.params.transactionId,
      req.params.userId
    );
    logger.info(`Transaction ${transactionId} deleted for user ID: ${userId}`);
    res.status(200).json({
      status: true,
      message: "Transaction deleted successfully"
    });
  } catch (err) {
    logger.error(`Error deleting transaction ID: ${transactionId} for user ID: ${userId}`, { error: err });
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in deleting transaction"
    });
  }
};

// Get financial summary
exports.getSummary = async (req, res) => {
  const userId = req.params.userId;
  logger.info(`Retrieving financial summary for user ID: ${userId}`);

  try {
    const summary = await transactionService.getSummary(req.params.userId);
    logger.info(`Financial summary retrieved for user ID: ${userId}`);
    res.status(200).json({
      status: true,
      data: summary,
      message: "Financial summary retrieved successfully"
    });
  } catch (err) {
    logger.error(`Error retrieving financial summary for user ID: ${userId}`, { error: err });
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in retrieving financial summary"
    });
  }
};