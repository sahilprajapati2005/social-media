const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    followUnfollowUser,
    searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Search users (GET /api/users/search?query=...)
router.get('/search', protect, searchUsers);

// Profile Management
router.route('/profile')
    .put(protect, updateUserProfile); // Update own profile

router.route('/:id')
    .get(protect, getUserProfile); // View any user profile

// Follow/Unfollow
router.put('/:id/follow', protect, followUnfollowUser);

module.exports = router;