// sahilprajapati2005/social-media/.../server/routes/postRoutes.js

const express = require('express');
const { 
  createPost, 
  getFeedPosts, 
  likePost, 
  getUserPosts,
  searchPosts,
  getPostById, 
  addComment, // Make sure this is imported
  getComments  // We will create this next
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/feed', protect, getFeedPosts); 
router.get('/search', protect, searchPosts);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id/like', protect, likePost);
router.get('/profile/:id', protect, getUserPosts);
router.get('/:id', protect, getPostById);


// --- ADD THESE TWO LINES ---
router.post('/:id/comments', protect, addComment); // Handles POST for new comments
router.get('/:id/comments', protect, getComments);  // Handles GET to fetch comments
// ----------------------------

module.exports = router;