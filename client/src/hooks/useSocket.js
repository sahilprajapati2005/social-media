import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const useSocket = () => {
  const { user } = useSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    // Only connect if user is logged in
    if (user) {
      // Initialize Socket (Change port to 8900 or whatever your socket server runs on)
      socket.current = io("ws://localhost:8900"); 

      // Send logged-in user ID to socket server
      socket.current.emit("addUser", user._id);

      // Listen for online users list
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }

    // Cleanup on logout/unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user]);

  return { socket: socket.current, onlineUsers };
};

export default useSocket;