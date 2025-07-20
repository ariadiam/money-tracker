const User = require('../models/user.model');
const userService = require('../services/user.service');
const Transaction = require('../models/transaction.model');
const bcrypt = require('bcryptjs');

const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
  logger.info("Retrieving all users");

  try {
    const result = await userService.findAll();
    logger.info("Success in retrieving all users");
  res.status(200).json({
    status: true,
    data: result,
    message: "Users retrieved successfully"
  });
  
} catch (err) {
  logger.error("Problem in retrieving users", err);
  res.status(400).json({
    status: false,
    data: null,
    message: "Error in retrieving users"
  })
  }
}

exports.findOne = async(req, res) => {
  let userId = req.params.userId;
  logger.info(`Retrieving user with ID: ${userId}`);

  try {
    const result = await userService.findOne(userId);

    if (result) {
    logger.info(`User ${userId} found`);
    res.status(200).json({
      status: true,
      data: result,
      message: "User retrieved successfully"
    });
  } else {
    logger.warn(`User ${userId} not found`);
    res.status(404).json({
      status: false,
      data: null,
      message: "User not found"
    });
  }
 } catch (err) {
    logger.error("Error retrieving user", { error: err });
    res.status(400).json({
      status: false,
      data:null,
      message: "Error in retrieving user"
    });
  }
}

exports.create = async(req, res) => {
  let data = req.body;
  logger.info("Attempting to create new user", { username: data.username });
  const SaltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, SaltOrRounds);

  const newUser = new User({
    username: data.username,
    password: data.password, 
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    phone: data.phone
  });

  try {
    const result = await newUser.save();
    logger.info(`User ${data.username} created successfully`);

    res.status(200).json({
      status: true,
      data: result,
      message: "User created successfully"
    });
  } catch (err) {
    logger.error("Error in creating user", { error: err });
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in creating user"
    });
  }
}

exports.updateById = async (req, res) => {
  const userId = req.params.userId; 
  logger.info(`Updating user with ID: ${userId}`);

  const updateData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone
  };

  if (req.body.password) {
    updateData.password = await bcrypt.hash(req.body.password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // Returns updated doc + validates data
    );

    if (!updatedUser) {
      logger.warn(`User ${userId} not found for update`);
      return res.status(404).json({ 
        status: false, 
        data: null,
        message: "User not found" 
      });
    }

    logger.info(`User ${userId} updated successfully`);
    res.status(200).json({
      status: true,
      data: updatedUser,
      message: "User updated successfully"
    });
  } catch (err) {
    logger.error("Error updating user", { error: err });
    res.status(400).json({
      status: false,
      data: null,
      message: err.message 
    });
  }
};

exports.deleteById = async (req, res) => {
  const userId = req.params.userId; 
 logger.info(`Attempting to delete user with ID: ${userId}`);

  try {
    const result = await User.findByIdAndDelete(userId); 
    if (!result) {
       logger.warn(`User ${userId} not found for deletion`);
      return res.status(404).json({
        status: false,
        data: null,
        message: "User not found"
      });
    }

    await Transaction.deleteMany({ user: userId });
    logger.info(`User ${userId} and associated transactions deleted`);

    res.status(200).json({
      status: true,
      data: result,
      message: "User and associated transactions deleted successfully"
    });
  } catch (err) {
    logger.error("Error deleting user", { error: err });
    res.status(400).json({
      status: false,
      data: null,
      message: err.message 
    });
  }
};


