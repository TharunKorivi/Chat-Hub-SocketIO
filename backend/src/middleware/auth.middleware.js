import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res
        .status(400)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token signature or secret key

    if (!decoded)
      return res.status(400).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId).select("-password"); // now check with the payload of token i.e user info

    if (!user) return res.status(400).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protect route middleware");
    res.status(500).json({ message: "Internal Server error" });
  }
};
