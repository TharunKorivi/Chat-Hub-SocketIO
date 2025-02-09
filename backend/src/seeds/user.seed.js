import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

config();

const salt = await bcrypt.genSalt(10);
const password = await bcrypt.hash("123456", salt);

const seedUsers = [
  // Female Users
  {
    email: "sneha.reddy@example.com",
    fullName: "Sneha Reddy",
    password,
    profilePic: "",
  },
  {
    email: "samyuktha@example.com",
    fullName: "Samyuktha",
    password,
    profilePic: "",
  },
  {
    email: "keerthi@example.com",
    fullName: "Keerthi",
    password,
    profilePic: "",
  },
  {
    email: "divya.naidu@example.com",
    fullName: "Divya Naidu",
    password,
    profilePic: "",
  },
  {
    email: "priya.kumar@example.com",
    fullName: "Priya Kumar",
    password,
    profilePic: "",
  },
  {
    email: "lavanya.yadav@example.com",
    fullName: "Lavanya Yadav",
    password,
    profilePic: "",
  },
  {
    email: "bhavya.reddy@example.com",
    fullName: "Bhavya Reddy",
    password,
    profilePic: "",
  },
  {
    email: "sandhya.rao@example.com",
    fullName: "Sandhya Rao",
    password,
    profilePic: "",
  },

  // Male Users
  {
    email: "arjun.reddy@example.com",
    fullName: "Arjun Reddy",
    password,
    profilePic: "",
  },
  {
    email: "saivishnu@example.com",
    fullName: "Sai Vishnu Koduri",
    password,
    profilePic: "",
  },
  {
    email: "siddhanthsaaho@example.com",
    fullName: "Siddanth Nandan Saaho",
    password,
    profilePic: "",
  },
  {
    email: "mahesh@example.com",
    fullName: "Mahesh Dumpa",
    password,
    profilePic: "",
  },
  {
    email: "naveen@example.com",
    fullName: "Naveen",
    password,
    profilePic: "",
  },
  {
    email: "jayanth@example.com",
    fullName: "Jayanth Thuppakula",
    password,
    profilePic: "",
  },
  {
    email: "abhilash@example.com",
    fullName: "Abhilash Gonela",
    password,
    profilePic: "",
  },
  {
    email: "balramulu@example.com",
    fullName: "Balaramulu Narsagalla",
    password,
    profilePic: "",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
