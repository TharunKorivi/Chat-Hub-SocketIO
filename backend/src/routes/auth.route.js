import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
  check,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);


router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);



router.get("/check", protectRoute, check);

export default router;
