import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

let io;

// Map<userId, Set<socketId>>
const userSocketMap = new Map();

export const getReceiverSocketId = (receiverId) => {
  const sockets = userSocketMap.get(receiverId);
  if (!sockets || sockets.size === 0) return null;
  return [...sockets][0];
};

export const emitToUser = (receiverId, event, data) => {
  const sockets = userSocketMap.get(receiverId);
  if (!sockets) return;
  sockets.forEach((socketId) => {
    io.to(socketId).emit(event, data);
  });
};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.jwt;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.userId;

    if (userId) {
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId).add(socket.id);
    }

    io.emit("getOnlineUsers", [...userSocketMap.keys()]);

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);

      if (userId) {
        const sockets = userSocketMap.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) userSocketMap.delete(userId);
        }
      }

      io.emit("getOnlineUsers", [...userSocketMap.keys()]);
    });
  });
};

export { io };
