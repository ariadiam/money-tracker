const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { generateAccessToken, verifyToken, validateCredentials, checkExistingUser } = require('../services/auth.service');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for user:', username);

  if (!username || !password) {
    return res.status(400).json({
      status: false,
      error: 'Username and password are required'
    });
  }

  try {
    const user = await validateCredentials(username, password);

    const token = generateAccessToken(user);

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({
      status: true,
      data: { user: userData, token },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error.message);
    const statusCode = 
    error.message === 'User not found' ? 404 :
    error.message === 'Invalid credentials' ? 401 : 500;

    res.status(statusCode).json({
      status: false,
      error: error.message || 'Login failed, please try again.'
    });
  }
}

exports.register = async (req, res) => {
  const { username, password, firstname, lastname, email, phone } = req.body;

  try {
    await checkExistingUser(username, email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstname,
      lastname,
      email,
      phone,
      role: 'user'
    });
    const token = generateAccessToken(newUser);

    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({
      status: true,
      data: { user: userData, token },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    const statusCode = error.message === 'User already exists' ? 400 : 500;
    res.status(statusCode).json({
      status: false,
      error: error.message || 'Registration failed, please try again.'
    });
  }
}