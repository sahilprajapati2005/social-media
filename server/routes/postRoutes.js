const express = require('express');
const { createPost, getFeedPosts, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route: /api/posts
router.route('/')
    .get(protect, getFeedPosts) // Get Feed
    .post(protect, upload.single('image'), createPost); // Create Post (expects 'image' field)

// Route: /api/posts/:id/like
router.put('/:id/like', protect, likePost);

module.exports = router;