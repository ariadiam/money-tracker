const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

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
    console.log('Fetching user from database:', username);
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json({ 
        status: false, 
        error: 'User not found' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: false, 
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({
      status: true,
      data: {
        user: userData,
        token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: false, 
      error: 'Internal server error' 
    });
  }
};


exports.register = async (req, res) => {
  const { username, password, firstname, lastname, email, phone } = req.body;

  try {
    const existingUser = await User.findOne({ $or: { username, email } });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        error: 'Username or email already exists'
      });
    }

    const newUser = await User.create({
      username,
      password,
      firstname,
      lastname,
      email,
      phone
    });

    await newUser.save();

    const token = newUser.generateAuthToken();
    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({
      status: true,
      data: {
        user: userData,
        token
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: false,
      error: 'Registration failed, please try again.'
    });
  }
}