
const express = require('express');
const passport = require('passport'); 
const generateToken = require('../utils/generateToken'); 
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword,
    verifyOtp,
    resendOtp 
} = require('../controllers/authController');

// --- Standard Auth Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- Google Auth Routes ---

// 1. Initiate Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Handle the Callback from Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate token and redirect to frontend
    generateToken(res, req.user._id);
    res.redirect('http://localhost:5173'); 
  }
);

module.exports = router;
