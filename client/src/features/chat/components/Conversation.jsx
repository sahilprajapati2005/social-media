import React, { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import Avatar from '../../../components/ui/Avatar';

const Conversation = ({ conversation, currentUserId, onlineUsers }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUserId);

    const getUser = async () => {
      try {
        const res = await api.get("/users/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUserId, conversation]);

  if (!user) return null;

  // Check if this specific friend is in the onlineUsers array
  const isOnline = onlineUsers?.some((u) => u.userId === user._id);

  return (
    <div className="flex items-center gap-4 p-2.5 hover:bg-gray-100 cursor-pointer rounded-lg transition">
      <div className="relative">
        <Avatar src={user.profilePicture} size="sm" />
        {isOnline && (
          <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
        )}
      </div>
      <span className="font-medium text-gray-900">{user.username}</span>
    </div>
  );
};

export default Conversation;