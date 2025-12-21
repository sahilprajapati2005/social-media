const User = require('../models/User');
const Otp = require('../models/Otp'); // Import OTP model
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail'); // Import Email utility
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
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
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
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
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

// @desc    Send OTP to email (Forgot Password)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB (Expires in 5 mins automatically via Otp model)
        await Otp.create({ email, otp: otpCode });

        // Send Email
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
        // 1. Check if OTP is valid
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 3. Hash New Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt); // Note: We hash manually here because .save() hook logic can be tricky if not handling "isModified" correctly
        
        await user.save();

        // 4. Delete OTP after successful use
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
};