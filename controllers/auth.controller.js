const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  console.log("Login attempt for user:", req.body.username);
  
  const username = req.body.username;
  const password = req.body.password;

  try {
    // Check if user exists
    const user = await User.findOne({username: username });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("Login successful");
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};