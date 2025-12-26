const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createConversation, 
    getConversations 
} = require('../controllers/conversationController');

// Using the protect middleware ensures only logged-in users can chat
router.post('/', protect, createConversation);
router.get('/:userId', protect, getConversations);

module.exports = router;