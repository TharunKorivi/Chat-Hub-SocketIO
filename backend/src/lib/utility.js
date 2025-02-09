import jwt from "jsonwebtoken";

// jwt contains header.payload.signature

// header contains data about token type like how secure , expire etc

// payload -> user data which helps in authorization and authentication

// signature -> acutal secret token

export const generateToken = (userId, res) => {
  // here userId is passed for payload

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // only http requests prevent XSS attacks i.e cross-site scripting
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie age
    sameSite: "strict", // forgery cross site requests
    secure: process.env.NODE_ENV !== "development", // secure ony in production
  });
};
