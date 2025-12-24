import { useCallback } from 'react';

const useChatSocket = (socket) => {
  
  const sendMessage = useCallback(({ senderId, receiverId, text }) => {
    if (!socket) return;

    socket.emit("sendMessage", {
      senderId,
      receiverId,
      text,
    });
  }, [socket]);

  return { sendMessage };
};

export default useChatSocket;