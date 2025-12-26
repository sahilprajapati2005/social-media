const Conversation = require('../models/Conversation');

// @desc    Get all conversations for a specific user ID
// @route   GET /api/conversations/:userId
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: -1 });
    
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch conversations" });
  }
};

// @desc    Create a new conversation between two users
// @route   POST /api/conversations
const createConversation = async (req, res) => {
  try {
    // Check if conversation already exists to avoid duplicates
    const existing = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (existing) return res.status(200).json(existing);

    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json({ message: "Could not create conversation" });
  }
};

module.exports = { getConversations, createConversation };