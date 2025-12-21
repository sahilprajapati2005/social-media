const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const newMessage = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            content
        });

        // Populate sender info to send back to frontend immediately
        const fullMessage = await newMessage.populate('sender', 'username profilePicture');

        res.status(201).json(fullMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversation between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params; // The other user's ID

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id }
            ]
        })
        .sort({ createdAt: 1 }) // Oldest first
        .populate('sender', 'username profilePicture');

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendMessage, getMessages };