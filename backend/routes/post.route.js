import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deleteComment, deletePost, getAllPost, getCommentOfPost, getUserPost, likePost, unlikePost } from "../controllers/post.controller.js";
const router = express.Router();

router.route("/addpost").post(isAuthenticated,upload.single('image'),addNewPost);
router.route("/all").get(isAuthenticated,getAllPost);
router.route("/userpost/all").get(isAuthenticated,getUserPost);
router.route("/:id/like").get(isAuthenticated,likePost);
router.route("/:id/dislike").get(isAuthenticated,unlikePost);
router.route("/:id/comment").post(isAuthenticated,addComment);
router.route("/:id/comment/all").post(isAuthenticated,getCommentOfPost);
router.route("/delete/:id").delete(isAuthenticated,deletePost);
router.route("/delete/comment/:id").post(isAuthenticated,deleteComment);
router.route("/:id/bookmarke").get(isAuthenticated,bookmarkPost);


export default router