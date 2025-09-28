
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ user, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      // Connect to backend server
      const socketio = io(import.meta.env.VITE_BACKEND_URL, {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      setSocket(socketio);

      // Listen for events
    //   socketio.on("connect", () => {
    //     console.log("✅ Socket connected:", socketio.id);
    //   });

      socketio.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        socketio.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
