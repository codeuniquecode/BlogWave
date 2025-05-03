const express = require('express');
const passport = require('passport');
const router = express.Router();

const jwt = require('jsonwebtoken');
// Trigger login with Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle callback and redirect
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function(req, res) {
    // req.user is available thanks to passport
    const token = jwt.sign({ id: req.user._id }, process.env.SECRETKEY, {
      expiresIn: '1d'
    });

    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true
    });

    res.redirect('/');
  });

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
