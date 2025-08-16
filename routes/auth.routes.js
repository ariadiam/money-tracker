const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/google', (req, res) => {   
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.GOOGLE_REDIRECT_URI); 
  const scope = encodeURIComponent('email profile');
  const url =
    `https://accounts.google.com/o/oauth2/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&prompt=consent`; 
  res.redirect(url);
});
router.get('/google/callback', authController.googleLogin);

module.exports = router;