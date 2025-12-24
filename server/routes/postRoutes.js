// const express = require('express');
// const { createPost, getFeedPosts, likePost } = require('../controllers/postController');
// const { protect } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

// const router = express.Router();

// // Route: /api/posts
// router.route('/')
//     .get(protect, getFeedPosts) // Get Feed
//     .post(protect, upload.single('image'), createPost); // Create Post (expects 'image' field)

// // Route: /api/posts/:id/like
// router.put('/:id/like', protect, likePost);

// module.exports = router;

const express = require('express');
const { createPost, getFeedPosts, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Get Feed (specific path MUST come before generic '/')
router.get('/feed', protect, getFeedPosts); 

// Create Post (POST /api/posts)
router.post('/', protect, upload.single('image'), createPost);

// Like Post
router.put('/:id/like', protect, likePost);

module.exports = router;