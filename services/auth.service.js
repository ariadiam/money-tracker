const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model'); 
const { OAuth2Client } = require('google-auth-library');

function generateAccessToken(user) {
  console.log("Auth service: ", user)

  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role || 'user'
  }

  return jwt.sign(payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { verified: true, payload };
  } catch (err) {
    return { verified: false, error: err.message };
  }
}

async function validateCredentials(username, password) {
  const user = await User.findOne({ username }).select('+password');
  if (!user) throw new Error('User not found');

  const isMatch= await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  
  return user;
}

async function checkExistingUser(username, email) {
  console.log(`[checkExistingUser] Called with username: ${username}, email: ${email}`);
  const user = await User.findOne({
    $or: [
      { username }, 
      { email }    
    ]
  });
  if (user) 
   throw new Error('User already exists');
  return user;
}

async function googleAuth(code) {
  console.log("Google login");
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

  const OAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    const { tokens } = await OAuth2Client.getToken(code);
    OAuth2Client.setCredentials(tokens);

    const ticket = await OAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    });
    const userInfo = await ticket.getPayload();
    console.log("User Info: ", userInfo);
    return {
      user: userInfo, tokens
    }
  } catch (error) {
    console.error("Google Auth Error: ", error);
    return {
      error: 'Google authentication failed'
    }
  }
}

module.exports = {
  generateAccessToken,
  verifyToken,
  validateCredentials,
  checkExistingUser,
  googleAuth
}