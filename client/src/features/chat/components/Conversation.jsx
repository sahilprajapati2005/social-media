import React, { useEffect, useState } from 'react';
import Avatar from '../../../components/ui/Avatar';
import api from '../../../utils/axios';
import { formatTimeAgo } from '../../../utils/formatDate'; // <--- IMPORT TIME AGO

const Conversation = ({ conversation, currentUserId, onlineUsers }) => {
  const [friend, setFriend] = useState(null);

  // Find the other user in the conversation
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUserId);
    const getUser = async () => {
      try {
        const res = await api.get('/users/' + friendId);
        setFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUserId, conversation]);

  // Check if this specific friend is online
  const isOnline = onlineUsers?.some((u) => u.userId === friend?._id);

  return (
    <div className="flex items-center gap-3 p-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
      
      {/* Avatar with Online Dot */}
      <div className="relative">
        <Avatar src={friend?.profilePicture} size="sm" />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h4 className="font-semibold text-gray-900 truncate text-sm">
            {friend?.username || 'Loading...'}
          </h4>
          
          {/* Timestamp (e.g., "2m ago") */}
          {conversation.updatedAt && (
             <span className="text-[10px] text-gray-400">
               {formatTimeAgo(conversation.updatedAt)}
             </span>
          )}
        </div>
        
        {/* Last Message Preview (Optional) */}
        <p className="text-xs text-gray-500 truncate">
          Click to start chatting
        </p>
      </div>
    </div>
  );
};

export default Conversation;