// File: client/src/hooks/useSocket.js
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const useSocket = () => {
  const { user } = useSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  useEffect(() => {
    if (user?._id) {
      // Point to port 5000 where your server.js is listening
      socket.current = io("https://social-app-psi-beige.vercel.app", {
        withCredentials: true,
        transports: ["websocket", "polling"], // Added polling as a fallback
        reconnectionAttempts: 5,
      });

      socket.current.emit("addUser", user._id);

      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
      
      // Log for your peace of mind
      socket.current.on("connect", () => {
        console.log("Connected to Socket Server!");
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user?._id]); // Added optional chaining for stability

  return { socket: socket.current, onlineUsers };
};

export default useSocket;