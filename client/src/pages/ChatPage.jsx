import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineSend, AiOutlineArrowLeft } from 'react-icons/ai';

// API & Hooks
import api from '../utils/axios';
import useSocket from '../hooks/useSocket';            // 1. Global Connection
import useChatSocket from '../features/chat/useSocket'; // 2. Chat Logic (Send/Receive)

// Components
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

  // --- SOCKET INTEGRATION ---
  // 1. Get the active socket connection and online users list
  const { socket, onlineUsers } = useSocket();

  // 2. Use the Chat Hook to handle sending/receiving logic
  // Note: We don't need to manually listen for 'getMessage' here because 
  // useChatSocket handles that and updates Redux (if you are using Redux for messages).
  // If you are using local state for messages (like below), we can use the hook's helper functions.
  const { sendMessage } = useChatSocket(socket);

  // --- EFFECTS ---

  // 1. Fetch Conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await api.get('/conversations/' + user._id);
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getConversations();
  }, [user._id]);

  // 2. Fetch Messages when Chat Selected
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;
      try {
        const res = await api.get('/messages/' + currentChat._id);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getMessages();
  }, [currentChat]);

  // 3. Fetch Friend Details for Header
  useEffect(() => {
    const getFriendDetails = async () => {
      if (!currentChat) return;
      const friendId = currentChat.members.find((m) => m !== user._id);
      try {
        const res = await api.get('/users/' + friendId);
        setChatFriend(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getFriendDetails();
  }, [currentChat, user._id]);

  // 4. Handle Incoming Messages (Local State Update)
  // Even though Redux handles it globally, we often update local state for immediate feedback
  useEffect(() => {
    if (!socket) return;
    
    const handleIncomingMessage = (data) => {
      // Only add message if it belongs to the CURRENT open chat
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

  // 5. Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // --- HANDLERS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const receiverId = currentChat.members.find((member) => member !== user._id);

    // 1. Send via Socket (Instant UI update for receiver)
    sendMessage({
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    // 2. Send to Database (Persistence)
    try {
      const res = await api.post("/messages", {
        conversationId: currentChat._id,
        sender: user._id,
        text: newMessage,
      });
      
      // Update local UI immediately
      setMessages([...messages, res.data]);
      setNewMessage("");
      
    } catch (err) {
      console.error(err);
    }
  };

  // --- RENDER ---
  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
      
      {/* SIDEBAR */}
      <div className={`flex flex-col border-r border-gray-200 bg-white ${currentChat ? 'hidden md:flex md:w-1/3 lg:w-1/4' : 'w-full'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => (
            <div 
              key={c._id} 
              onClick={() => setCurrentChat(c)}
              className={`rounded-lg transition ${currentChat?._id === c._id ? 'bg-blue-50' : ''}`}
            >
              <Conversation 
                conversation={c} 
                currentUserId={user._id} 
                onlineUsers={onlineUsers} // Now passing real online users!
              />
            </div>
          ))}
        </div>
      </div>

      {/* CHAT BOX */}
      <div className={`flex flex-col bg-gray-50 ${currentChat ? 'w-full md:w-2/3 lg:w-3/4' : 'hidden md:flex md:w-2/3 lg:w-3/4'}`}>
        
        {currentChat ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
              <button onClick={() => setCurrentChat(null)} className="md:hidden text-gray-600">
                <AiOutlineArrowLeft className="text-xl" />
              </button>
              
              <Avatar src={chatFriend?.profilePicture} size="sm" />
              <div>
                <span className="block font-bold text-gray-900">{chatFriend?.username || "Loading..."}</span>
                {/* Check if friend is online */}
                {onlineUsers.some(u => u.userId === chatFriend?._id) ? (
                   <span className="block text-xs text-green-500 font-medium">Online</span> 
                ) : (
                   <span className="block text-xs text-gray-400">Offline</span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              {messages.map((m, index) => (
                <div ref={scrollRef} key={index}>
                  <Message 
                    message={m} 
                    own={m.sender === user._id}
                    senderProfilePic={chatFriend?.profilePicture}
                  />
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                  type="text"
                  className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="rounded-full bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:bg-blue-400"
                >
                  <AiOutlineSend className="text-xl" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-600">Your Messages</h3>
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;