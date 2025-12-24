const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, email, password });

        if (user) {
            const token = generateToken(res, user._id);
            
            // ✅ FIX: Send nested 'user' object so Redux can read it correctly
            res.status(201).json({
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                },
                token: token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id);

            // ✅ FIX: Send nested 'user' object here too
            res.json({
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                },
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Verify OTP (Registration/Login)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Otp.deleteMany({ email });

        const token = generateToken(res, user._id);

        // This was already correct, but keeping for consistency
        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send OTP to email (Forgot Password or Resend)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({ email, otp: otpCode });

        const message = `You requested a password reset. Your OTP is: ${otpCode}. It is valid for 5 minutes.`;
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP - Social Media App',
            message,
        });

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Email could not be sent', error: error.message });
    }
};

// @desc    Verify OTP and Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ FIX: Do not hash manually. Let the User model pre-save hook handle it.
        user.password = newPassword; 
        
        await user.save();
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, 
    });

    const message = `Your new verification code is: ${otp}`;
    await sendEmail({
      email: user.email,
      subject: 'Resend OTP Verification',
      message,
    });

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyOtp,
    forgotPassword,
    resetPassword,
    resendOtp
};