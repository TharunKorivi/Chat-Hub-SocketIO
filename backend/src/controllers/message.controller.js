import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatToId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: chatToId },
        { senderId: chatToId, receiverId: senderId },
      ],
    });

    if (!messages)
      return res.status(400).json({ message: "No messages received" });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in get Users controller ");
    res.status(500).json({ message: "Internal server error" });
  }
};

import { uploadOnCloudinary } from "../lib/cloudinary.js";

export const sendMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { text } = req.body;
    const chatToId = req.params.id;

    let imageUrl = "";

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);

      if (uploadResult) {
        imageUrl = uploadResult.secure_url;
      }
    }

    const newMessage = new Message({
      senderId: myId,
      receiverId: chatToId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(chatToId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
