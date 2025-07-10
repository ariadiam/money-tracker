const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'No token provided, authorization denied'
    });
  }

  const secret = process.env.JWT_SECRET;

  try { 
    const decoded = jwt.verify(token, secret);
    console.log('Token verified:', decoded);
    next();
  } catch (err) {
    return res.status(404).json({
      status: false,
      data: err
    })
  }
}

module.exports = {
  verifyToken
}