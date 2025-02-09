import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utility.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  console.log(req.body);

  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6)
      return res
        .status("400")
        .json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    await newUser.save();

    if (!newUser)
      return res.status(400).json({ message: "Invalid user details." });

    generateToken(newUser._id, res); // generate token

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in sign up controller ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller");
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true, // only http requests prevent XSS attacks i.e cross-site scripting
      maxAge: 0, // cookie age
      sameSite: "strict", // forgery cross site requests
      secure: process.env.NODE_ENV !== "Development", // secure ony in production
    });
    res.status(200).json({ messsage: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    if (!updateUser)
      return res.status(500).json({ message: "Internal server error" });

    res.status(200).json(updateUser);
    console.log(res);
  } catch (error) {
    console.log("Error in update profile controller");
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const check = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check controller", error.message);
    res.staus(500).json({ message: "Internal server error" });
  }
};
