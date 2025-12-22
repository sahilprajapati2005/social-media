import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const useSocket = () => {
  const socket = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && !socket.current) {
      // Connect to backend socket
      socket.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        transports: ['websocket'],
        query: { userId: user._id },
      });

      socket.current.on('connect', () => {
        console.log('Socket Connected:', socket.current.id);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [user]);

  return socket.current;
};

export default useSocket;