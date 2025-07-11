const jwt = require('jsonwebtoken');
const { verifyToken } = require('../services/auth.service');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =  authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'No token provided, authorization denied'
    });
  }

  const { verified, payload, error } = verifyToken(token);
  if (!verified) {
    return res.status(401).json({
      status: false,
      message: error || 'Invalid token'
    });
  }

  req.user = payload;
  next();
}

module.exports = {
  verifyToken
}