import express from "express";
import {
  editProfile,
  folloOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
  verifyEmail,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/verifyemail").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollw/:id").get(isAuthenticated, folloOrUnfollow);


export default router