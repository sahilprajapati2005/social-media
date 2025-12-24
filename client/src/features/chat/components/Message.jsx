import React from 'react';
import { format } from 'timeago.js'; // Optional: Install 'timeago.js' for nice dates
import Avatar from '../../../components/ui/Avatar';

const Message = ({ message, own, senderProfilePic }) => {
  return (
    <div className={`flex flex-col mt-4 ${own ? 'items-end' : 'items-start'}`}>
      <div className="flex gap-2 max-w-[70%]">
        {/* Only show avatar for received messages */}
        {!own && (
          <Avatar src={senderProfilePic} size="xs" className="mt-1" />
        )}
        
        <div className={`p-3 rounded-2xl text-sm ${
          own 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
        }`}>
          <p>{message.text}</p>
        </div>
      </div>
      
      <div className="mt-1 text-xs text-gray-400 px-1">
        {format(message.createdAt)}
      </div>
    </div>
  );
};

export default Message;