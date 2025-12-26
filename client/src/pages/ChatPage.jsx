import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineSend, AiOutlineArrowLeft } from 'react-icons/ai';

import api from '../utils/axios';
import useSocket from '../hooks/useSocket';
import useChatSocket from '../features/chat/useSocket';
import Conversation from '../features/chat/components/Conversation';
import Message from '../features/chat/components/Message';
import Avatar from '../components/ui/Avatar';

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const scrollRef = useRef();

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatFriend, setChatFriend] = useState(null);

  const { socket, onlineUsers } = useSocket();
  const { sendMessage } = useChatSocket(socket);

  // 1. Fetch Conversations
  useEffect(() => {
    const getConversations = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/conversations/${user._id}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
    getConversations();
  }, [user?._id]); 

  // 2. Fetch Messages (Aligned with backend GET /api/messages/:userId)
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id || !user?._id) return;
      const friendId = currentChat.members.find((m) => m !== user._id);
      try {
        const res = await api.get(`/messages/${friendId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    getMessages();
  }, [currentChat, user?._id]);

  // 3. Fetch Friend Details
  useEffect(() => {
    const getFriendDetails = async () => {
      if (!currentChat || !user?._id) return;
      const friendId = currentChat.members.find((m) => m !== user._id);
      try {
        const res = await api.get(`/users/${friendId}`);
        setChatFriend(res.data);
      } catch (err) {
        console.error("Error fetching friend details:", err);
      }
    };
    getFriendDetails();
  }, [currentChat, user?._id]);

  // 4. Handle Real-time Incoming Socket Messages
  useEffect(() => {
    if (!socket) return;
    const handleIncomingMessage = (data) => {
      // Check if message belongs to the current chat room
      if (currentChat?.members.includes(data.senderId)) {
        setMessages((prev) => [...prev, {
          sender: { _id: data.senderId }, // Structure to match populated DB response
          content: data.text,            // Map socket 'text' to DB 'content'
          createdAt: Date.now(),
        }]);
      }
    };
    socket.on("getMessage", handleIncomingMessage);
    return () => socket.off("getMessage", handleIncomingMessage);
  }, [socket, currentChat]);

  // 5. Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 6. HANDLER: Sending a Message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat || !user?._id) return;

    const receiverId = currentChat.members.find((member) => member !== user._id);
    if (!receiverId) return;

    // Emit socket event for real-time delivery
    sendMessage({
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      // MUST use 'receiverId' and 'content' to match messageController.js
      const res = await api.post("/messages", {
        receiverId: receiverId, 
        content: newMessage,    
      });
      
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err.response?.data?.message || err.message);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading chat...</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
      {/* Side List */}
      <div className={`flex flex-col border-r border-gray-200 bg-white ${currentChat ? 'hidden md:flex md:w-1/3 lg:w-1/4' : 'w-full'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((c) => (
            <div 
              key={c._id} 
              onClick={() => setCurrentChat(c)}
              className={`rounded-xl cursor-pointer ${currentChat?._id === c._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <Conversation conversation={c} currentUserId={user._id} onlineUsers={onlineUsers} />
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex flex-col bg-gray-50/30 ${currentChat ? 'w-full md:w-2/3 lg:w-3/4' : 'hidden md:flex md:w-2/3 lg:w-3/4'}`}>
        {currentChat ? (
          <>
            <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
              <button onClick={() => setCurrentChat(null)} className="md:hidden p-2"><AiOutlineArrowLeft /></button>
              <Avatar src={chatFriend?.profilePicture} size="sm" />
              <div>
                <span className="block font-bold">{chatFriend?.username}</span>
                <span className={`text-[10px] uppercase font-bold ${onlineUsers.some(u => u.userId === chatFriend?._id) ? 'text-green-500' : 'text-gray-400'}`}>
                  {onlineUsers.some(u => u.userId === chatFriend?._id) ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m, index) => (
                <div ref={scrollRef} key={m._id || index}>
                  <Message 
                    message={m} 
                    // Backend returns sender as an object, check both ID locations
                    own={(m.sender._id || m.sender) === user._id}
                    senderProfilePic={chatFriend?.profilePicture}
                  />
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-5 py-3 outline-none focus:border-blue-500"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 p-3 text-white rounded-full">
                  <AiOutlineSend className="text-xl" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Select a chat to start</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;