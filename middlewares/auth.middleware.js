const jwt = require('jsonwebtoken');
const { verifyToken: verifyTokenService } = require('../services/auth.service');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =  authHeader && authHeader.split(' ')[1];
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'No token provided, authorization denied'
    });
  }

  const { verified, payload, error } = verifyTokenService(token);
  if (!verified) {
    return res.status(401).json({
      status: false,
      message: error || 'Invalid token'
    });
  }

  req.user = payload;
  next();
}

function verifyRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        status: false,
        message: 'Access denied, no user role found'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: 'Access denied, insufficient permissions'
      });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  verifyRoles
};