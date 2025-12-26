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

  // --- STATE ---
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatFriend, setChatFriend] = useState(null);

  // --- SOCKETS ---
  const { socket, onlineUsers } = useSocket();
  const { sendMessage } = useChatSocket(socket);

  // 1. Fetch Conversations
  useEffect(() => {
    const getConversations = async () => {
      if (!user?._id) return; // Safety check
      try {
        // Fetches all conversation "rooms" the current user belongs to
        const res = await api.get(`/conversations/${user._id}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
    getConversations();
  }, [user?._id]); 

  // 2. Fetch Messages when a specific Chat is Selected
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) return;
      try {
        const res = await api.get(`/messages/${currentChat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    getMessages();
  }, [currentChat]);

  // 3. Fetch Friend Details (to show their name/pic in the header)
  useEffect(() => {
    const getFriendDetails = async () => {
      if (!currentChat || !user?._id) return;
      // Find the ID of the other person in the conversation
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
      // Only add message to UI if it belongs to the active chat room
      if (currentChat?.members.includes(data.senderId)) {
        setMessages((prev) => [...prev, {
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        }]);
      }
    };
    socket.on("getMessage", handleIncomingMessage);
    return () => {
      socket.off("getMessage", handleIncomingMessage);
    };
  }, [socket, currentChat]);

  // 5. Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // --- HANDLER: Sending a Message ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const receiverId = currentChat.members.find((member) => member !== user._id);

    // Send via Socket for real-time delivery
    sendMessage({
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    // Save to Database via API
    try {
      const res = await api.post("/messages", {
        conversationId: currentChat._id,
        sender: user._id,
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Prevent UI rendering before user is authenticated
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="text-gray-500 animate-pulse font-medium">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
      
      {/* SIDEBAR: Conversation List */}
      <div className={`flex flex-col border-r border-gray-200 bg-white ${currentChat ? 'hidden md:flex md:w-1/3 lg:w-1/4' : 'w-full'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length > 0 ? (
            conversations.map((c) => (
              <div 
                key={c._id} 
                onClick={() => setCurrentChat(c)}
                className={`rounded-xl transition-all cursor-pointer hover:bg-gray-50 ${currentChat?._id === c._id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
              >
                <Conversation 
                  conversation={c} 
                  currentUserId={user._id} 
                  onlineUsers={onlineUsers} 
                />
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-sm text-gray-400">No conversations yet.</p>
          )}
        </div>
      </div>

      {/* CHAT BOX: Message Area */}
      <div className={`flex flex-col bg-gray-50/30 ${currentChat ? 'w-full md:w-2/3 lg:w-3/4' : 'hidden md:flex md:w-2/3 lg:w-3/4'}`}>
        
        {currentChat ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm z-10">
              <button onClick={() => setCurrentChat(null)} className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-full">
                <AiOutlineArrowLeft className="text-xl" />
              </button>
              
              <Avatar src={chatFriend?.profilePicture} size="sm" />
              <div className="flex flex-col">
                <span className="block font-bold text-gray-900 leading-none">{chatFriend?.username || "Loading..."}</span>
                {onlineUsers.some(u => u.userId === chatFriend?._id) ? (
                   <span className="block text-[10px] text-green-500 font-bold uppercase mt-1 tracking-wider">Online</span> 
                ) : (
                   <span className="block text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wider">Offline</span>
                )}
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length > 0 ? (
                messages.map((m, index) => (
                  <div ref={scrollRef} key={m._id || index}>
                    <Message 
                      message={m} 
                      own={m.sender === user._id}
                      senderProfilePic={chatFriend?.profilePicture}
                    />
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                  Send a message to start the conversation!
                </div>
              )}
            </div>

            {/* Message Input Bar */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
                <input
                  type="text"
                  className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-5 py-3 focus:border-blue-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="rounded-full bg-blue-600 p-3.5 text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none"
                >
                  <AiOutlineSend className="text-xl" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 bg-white">
            <div className="text-7xl mb-6 grayscale opacity-20">💬</div>
            <h3 className="text-2xl font-bold text-gray-700">Your Chatbox</h3>
            <p className="mt-2 text-gray-500 max-w-xs">Select a conversation from the sidebar to view messages or start a new chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;