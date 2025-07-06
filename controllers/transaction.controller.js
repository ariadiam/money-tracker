const transactionService = require('../services/transaction.service');

// Get all transactions for a user
exports.getUserTransactions = async (req, res) => {
  console.log("Get all transactions for user with ID:", req.params.userId);

  try {
    const transactions = await transactionService.getByUserId(req.params.userId);
    res.status(200).json({
      status: true,
      data: transactions
    });
  } catch (err) {
    console.log("Error in retrieving transactions", err);
    res.status(400).json({
      status: false,
      data: err 
    });
  }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
  console.log("Add a new transaction for user with ID:", req.params.userId);

  try {
    const transaction = await transactionService.create(
      req.params.userId,
      req.body
    );
    res.status(201).json({
      status: true,
      data: transaction,
      message: "Transaction added successfully"
    });
  } catch (err) {
    console.log("Error in adding transaction", err);
    res.status(400).json({
      status: false,
      data: err
    });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  console.log("Delete transaction with ID:", req.params.transactionId, "for user with ID:", req.params.userId);

  try {
    await transactionService.deleteById(
      req.params.transactionId,
      req.params.userId
    );
    res.status(200).json({
      status: true,
      message: "Transaction deleted successfully"
    });
  } catch (err) {
    console.log("Error in deleting transaction", err);
    res.status(400).json({
      status: false,
      data: err
    });
  }
};

// Get financial summary
exports.getSummary = async (req, res) => {
  console.log("Get financial summary for user with ID:", req.params.userId);

  try {
    const summary = await transactionService.getSummary(req.params.userId);
    res.status(200).json({
      status: true,
      data: summary
    });
  } catch (err) {
    console.log("Error in retrieving financial summary", err);
    res.status(400).json({
      status: false,
      data: err
    });
  }
};