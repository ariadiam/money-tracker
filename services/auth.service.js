const jwt = require('jsonwebtoken');

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
  const user = await User.findOne({ $or: { username, email } });
  if (user) throw new Error('User already exists');
  return user;
}

module.exports = {
  generateAccessToken,
  verifyToken,
  validateCredentials,
  checkExistingUser
}