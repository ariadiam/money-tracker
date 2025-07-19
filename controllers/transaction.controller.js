const transactionService = require('../services/transaction.service');

// Get all transactions for a user
exports.getUserTransactions = async (req, res) => {
  console.log("Get all transactions for user with ID:", req.params.userId);

  try {
    const transactions = await transactionService.getByUserId(req.params.userId);
    res.status(200).json({
      status: true,
      data: transactions,
      message: "Transactions retrieved successfully"
    });
  } catch (err) {
    console.log("Error in retrieving transactions", err);
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in retrieving transactions"
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
      data: null,
      message: "Error in adding transaction"
    });
  }
};

exports.updateTransaction = async (req, res) => {
  console.log("Update transaction with ID:", req.params.transactionId, "for user with ID:", req.params.userId);
  try {
    const updatedTransaction = await transactionService.update(
      req.params.transactionId,
      req.params.userId,
      req.body
    );
    res.status(200).json({ 
      status: true, 
      data: updatedTransaction,
      message: "Transaction updated successfully" 
    });
  } catch (err) {
    console.log("Error in updating transaction", err);
    res.status(400).json({ 
      status: false, 
      data: null,
      message: "Error in updating transaction"
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
      data: null,
      message: "Error in deleting transaction"
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
      data: summary,
      message: "Financial summary retrieved successfully"
    });
  } catch (err) {
    console.log("Error in retrieving financial summary", err);
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in retrieving financial summary"
    });
  }
};