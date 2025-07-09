import sharp from "sharp";
import cloudinary from "../util/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const autherId = req.id;
    if (!image) {
      return res.status(400).json({
        message: "image required",
      });
    }

    const optimizeimageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizeimageBuffer.toString(
      "base64"
    )}`;
    const response = await cloudinary.uploader.upload(fileUri);

    const newPost = await Post.create({
      caption,
      image: response.secure_url,
      author: autherId,
    });

    const user = await User.findById(autherId);
    if (user) {
      user.post.push(newPost._id);
      await user.save();
    }

    await newPost.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "new post added",
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) //sort({ createdAt: -1 }) eska matlab jo post baadme create hoy use pehele dikhana
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      success: true,
      message: "Get post successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const autherId = req.id;
    const posts = (
      await Post.find({ author: autherId }).sort({ createdAt: "-1" })
    )
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      success: true,
      message: "Get user post successfully",
      posts,
    });
  } catch (error) {}
};

export const likePost = async (req, res) => {
  try {
    const likekarneWala = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await post.updateOne({ $addToSet: { likes: likekarneWala } }); //addToSet matlab user ki id  tabhi add karna hai agar wo array me pehle se na ho
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likekarneWala).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();
    if (postOwnerId != likekarneWala) {
      const notification = {
        type: "like",
        userId: likekarneWala,
        userDetails: user,
        message: `Your post has been liked by ${user?.username}`,
      };
      const postOnwerSocketid = getReceiverSocketId(postOwnerId);
      io.to(postOnwerSocketid).emit("notification", notification);
    }

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    console.log(error);
  }
};

export const unlikePost = async (req, res) => {
  try {
    const unlikekarneWala = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await post.updateOne({ $pull: { likes: unlikekarneWala } }); //addToSet matlab user ki id  tabhi add karna hai agar wo array me pehle se na ho
    await post.save();

    /// implement socket io for real time notification
    const user = await User.findById(unlikekarneWala).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();
    if (postOwnerId != unlikekarneWala) {
      const notification = {
        type: "dislike",
        userId: unlikekarneWala,
        userDetails: user,
        message: `Your post has been disliked by ${user?.username}`,
      };
      const postOnwerSocketid = getReceiverSocketId(postOwnerId);
      io.to(postOnwerSocketid).emit("notification", notification);
    }

    return res.status(200).json({
      success: true,
      message: "Post unliked",
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKareneWalaUserId = req.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "taxt not found",
      });
    }

    const post = await Post.findById(postId);
    const comment = await Comment.create({
      text,
      author: commentKareneWalaUserId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture _id",
    });

    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // check if tha logged in user in tha oner od tha post
    if (post.author.toString() != authorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Post.findByIdAndDelete(postId);
    // remove post id in user schema
    const user = await User.findById(authorId);
    user.post = user.post.filter((id) => id.toString() != postId);
    await user.save();

    // delete comment jo es post ke hoge
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      // bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.id;

    // 1. Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // 2. Check if the user is the author of the comment
    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    // 3. Remove the comment ID from post.comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    // 4. Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting comment",
    });
  }
};
