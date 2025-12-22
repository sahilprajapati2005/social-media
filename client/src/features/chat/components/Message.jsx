import React from 'react';
import Avatar from '../../../components/ui/Avatar'; // Assuming you have this from your file tree
import { formatMessageTime } from '../../../utils/formatDate'; // <--- IMPORT THE UTILITY

const Message = ({ message, own, senderProfilePic }) => {
  return (
    <div className={`flex gap-3 mb-4 ${own ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* 1. Avatar (Only show for the other person) */}
      {!own && (
        <div className="mt-1">
          <Avatar src={senderProfilePic} size="xs" />
        </div>
      )}

      {/* 2. Message Content */}
      <div className={`flex flex-col max-w-[70%] ${own ? 'items-end' : 'items-start'}`}>
        
        {/* The Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${
            own
              ? 'bg-blue-600 text-white rounded-tr-none' // My Message (Blue)
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' // Friend's Message (White)
          }`}
        >
          <p>{message.text}</p>
        </div>

        {/* 3. The Timestamp (Using your new utility) */}
        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {formatMessageTime(message.createdAt)}
        </span>
        
      </div>
    </div>
  );
};

export default Message;