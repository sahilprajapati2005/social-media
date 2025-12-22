import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from './chatSlice'; // Importing action from your chatSlice

const useChatSocket = (socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Safety check: ensure socket is connected before listening
    if (!socket) return;

    // ------------------------------------------
    // 1. LISTEN: Incoming Messages
    // ------------------------------------------
    const handleReceiveMessage = (newMessage) => {
      // Update Redux state immediately so UI updates
      dispatch(addMessage(newMessage));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // ------------------------------------------
    // 2. LISTEN: Typing Events (Optional)
    // ------------------------------------------
    // You can add typing listeners here if you want
    // socket.on("userTyping", (userId) => ... );

    // ------------------------------------------
    // 3. CLEANUP
    // ------------------------------------------
    // Very important to turn off listeners to avoid duplicates
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };

  }, [socket, dispatch]);


  // ------------------------------------------
  // 4. EMIT: Helper functions to send data
  // ------------------------------------------
  
  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit("sendMessage", messageData);
    }
  };

  const sendTyping = (roomId) => {
    if (socket) {
      socket.emit("typing", roomId);
    }
  };

  const sendStopTyping = (roomId) => {
    if (socket) {
      socket.emit("stopTyping", roomId);
    }
  };

  return { 
    sendMessage, 
    sendTyping, 
    sendStopTyping 
  };
};

export default useChatSocket;