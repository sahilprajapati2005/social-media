const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    followUnfollowUser,
    searchUsers, // Ensure this is exported in userController.js
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// 1. SPECIFIC STATIC ROUTES FIRST
router.get('/search', protect, searchUsers); 
// router.get('/:id', protect, getUserProfile);// 

// 2. THE PROFILE ROUTE SECOND (So it doesn't get caught by :id)
router.route('/profile')
    .put(protect, upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPicture', maxCount: 1 }
    ]), updateUserProfile);

// 3. DYNAMIC PARAMETER ROUTES LAST
router.get('/:id', protect, getUserProfile); 
router.put('/:id/follow', protect, followUnfollowUser);

module.exports = router;