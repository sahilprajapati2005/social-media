const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array, // Array of user IDs participating in the chat
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);