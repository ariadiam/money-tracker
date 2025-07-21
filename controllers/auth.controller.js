const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { generateAccessToken, verifyToken, validateCredentials, checkExistingUser } = require('../services/auth.service');
const logger = require('../logger/logger');
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  logger.info(`Login attempt for username: ${username}`);

  if (!username || !password) {
    logger.warn('Missing username or password during login attempt');
    return res.status(400).json({
      status: false,
      data: null,
      message: 'Username and password are required'
    });
  }

  try {
    const user = await validateCredentials(username, password);

    const token = generateAccessToken(user);

    const { password: _, ...userData } = user.toObject();
    logger.info(`User logged in successfully: ${username}`);
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

    logger.error(`Login failed for username: ${username}`, { error: error.message });
    res.status(statusCode).json({
      status: false,
      data: null,
      message: error.message || 'Login failed, please try again.'
    });
  }
}

exports.register = async (req, res) => {
  const { username, password, firstname, lastname, email, phone } = req.body;
  logger.info(`Registration attempt for username: ${username}, email: ${email}`);

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
    logger.info(`User registered successfully: ${username}`);
    res.status(201).json({
      status: true,
      data: { user: userData, token },
      message: 'User registered successfully'
    });

  } catch (error) {
    const statusCode = error.message === 'User already exists' ? 400 : 500;
    logger.error(`Registration failed for username: ${username}`, { error: error.message });
    res.status(statusCode).json({
      status: false,
      data: null,
      message: error.message || 'Registration failed, please try again.'
    });
  }
}

exports.googleLogin = async (req, res) => {
  const code = req.query.code;
  logger.info(`Google login attempt with code: ${code}`);

  if (!code) {
    logger.warn('Google login code is missing');
    return res.status(400).json({
      status: false,
      data: null,
      message: 'Google login code is required'
    });
  } 
  try {
    const { user, tokens } = await authService.googleAuth(code);

  if (!user || typeof user !== 'object') {
      logger.warn('Google login failed: No user returned from auth service');
      return res.status(404).json({
        status: false,
        data: null,
        message: 'Google login failed, user not found'
      });
    }

    logger.info(`Google login successful for user: ${user?.email || 'unknown'}`);
    res.status(200).json({
      status: true,
      data: user,
      message: 'Google login successful'
    });

  } catch (error) {
    logger.error(`Internal server error during Google login: ${error.message}`);
    res.status(500).json({
      status: false,
      data: null,
      message: 'Internal server error during Google login'
    });
  }
}
