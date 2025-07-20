const User = require('../models/user.model');
const userService = require('../services/user.service');
const Transaction = require('../models/transaction.model');
const bcrypt = require('bcryptjs');

const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
  console.log("Find all users from collection users");

  try {
    // const result = await User.find();
    const result = await userService.findAll();
  res.status(200).json({
    status: true,
    data: result,
    message: "Users retrieved successfully"
  });
} catch (err) {
  console.log("Error in retrieving users:", err);
  logger.error("ERROR, problem in retrieving users", err);
  res.status(400).json({
    status: false,
    data: null,
    message: "Error in retrieving users"
  })
  }
}

exports.findOne = async(req, res) => {
  console.log("Find user with id:", userId);
  let userId = req.params.userId;

  try {
    // const result = await User.findOne({ username: username });
    const result = await userService.findOne(userId);
    if (result) {
    res.status(200).json({
      status: true,
      data: result,
      message: "User retrieved successfully"
    });
  } else {
    res.status(404).json({
      status: false,
      data: null,
      message: "User not found"
    });
  }
 } catch (err) {
    console.log("Error in retrieving user:", err)
    res.status(400).json({
      status: false,
      data:null,
      message: "Error in retrieving user"
    });
  }
}

exports.create = async(req, res) => {
  console.log("Create a new user");
  let data = req.body;
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
    res.status(200).json({
      status: true,
      data: result,
      message: "User created successfully"
    });
  } catch (err) {
    console.log("Error in creating user:", err);
    res.status(400).json({
      status: false,
      data: null,
      message: "Error in creating user"
    });
  }
}

exports.updateById = async (req, res) => {
  const userId = req.params.userId; 
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
      return res.status(404).json({ 
        status: false, 
        data: null,
        message: "User not found" 
      });
    }

    res.status(200).json({
      status: true,
      data: updatedUser,
      message: "User updated successfully"
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({
      status: false,
      data: null,
      message: err.message 
    });
  }
};

exports.deleteById = async (req, res) => {
  const userId = req.params.userId; 
  console.log("Delete user with ID:", userId);

  try {
    const result = await User.findByIdAndDelete(userId); 
    if (!result) {
      return res.status(404).json({
        status: false,
        data: null,
        message: "User not found"
      });
    }

    await Transaction.deleteMany({ user: userId });

    res.status(200).json({
      status: true,
      data: result,
      message: "User and associated transactions deleted successfully"
    });
  } catch (err) {
    console.log("Error deleting user:", err);
    res.status(400).json({
      status: false,
      data: null,
      message: err.message 
    });
  }
};


