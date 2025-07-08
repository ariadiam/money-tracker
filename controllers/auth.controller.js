const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: false,
      error: 'Username and password are required'
    });
  }

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
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