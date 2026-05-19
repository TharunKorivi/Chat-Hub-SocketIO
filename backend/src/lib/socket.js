import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

let io;

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) =>
  userSocketMap[receiverId];

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:"http://localhost:5173",
      credentials:true
    },
  });


io.use((socket, next) => {
  try {
    const cookies = cookie.parse(
      socket.handshake.headers.cookie || ""
    );

    const token = cookies.jwt;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

  io.on("connection", (socket) => {
    console.log("A user is connected", socket.id);

    const userId = socket.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // send online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);

      delete userSocketMap[userId];

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export { io };