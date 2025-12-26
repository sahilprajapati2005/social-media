const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    followUnfollowUser,
    searchUsers,
    getFollowingList, // Ensure this is exported in userController.js
    getFollowersList
     // Ensure this is exported in userController.js
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
// Add these to sahilprajapati2005/social-media/.../server/routes/userRoutes.js
router.get('/:id/following', protect, getFollowingList); // Get who a user follows
router.get('/:id/followers', protect, getFollowersList); // Get who follows a user

module.exports = router;