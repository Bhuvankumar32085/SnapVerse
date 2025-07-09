import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { selectedPost, setPost } from "@/redux/postSlice";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

function SinglePost({ post }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const user = useSelector((store) => store.auth);
  const posts = useSelector((store) => store.post.posts);
  const [like, setLike] = useState(post.likes.includes(user.user._id) || false);
  const [open, setOpen] = useState(false);
  const [postlikeCount, setPostLikeCount] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  const changeEventHandler = (e) => {
    if (e.target.value.trim()) {
      setText(e.target.value);
      // console.log(user.user._id);
      console.log(post);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (singlePost) => singlePost._id != post._id
        );
        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const likeAndDislikePostHandler = async (postId) => {
    try {
      const action = like ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${postId}/${action}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setPostLikeCount((prev) => (like ? prev - 1 : prev + 1));
        setLike(!like);
        //update post
        const updatedPostData = posts.map((p) =>
          p._id == postId
            ? {
                ...p,
                likes: like
                  ? p.likes.filter((id) => id !== user.user._id)
                  : [...p.likes, user.user._id],
              }
            : p
        );
        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id == post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const bookMarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmarke`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${post.author._id}`}>
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${post.author._id}`}>
              <h1>{post?.author?.username}</h1>
            </Link>
            {user.user._id == post.author._id && (
              <Badge className=" top-3 right-3 bg-white text-black text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-lg border border-gray-200 tracking-wide uppercase">
                👑 Author
              </Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {user.user?._id == post.author._id && (
              <Button 
                 
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button onClick={bookMarkHandler} variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            {user.user?._id == post.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Link to={`/profile/${post.author._id}`}>
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover"
          src={post.image}
          alt=""
        />
      </Link>

      <div className="flex justify-between items-center my-2">
        <div className="flex gap-2">
          {like ? (
            <FaHeart
              onClick={() => likeAndDislikePostHandler(post._id)}
              className="text-red-500 cursor-pointer"
              size={"25px"}
            />
          ) : (
            <FaRegHeart
              onClick={() => likeAndDislikePostHandler(post._id)}
              className=" cursor-pointer"
              size={"25px"}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(selectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          onClick={bookMarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>

      <span className="font-medium text-sm block mb-2 ">
        {postlikeCount} Likes
      </span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => {
          dispatch(selectedPost(post));
          setOpen(true);
        }}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all {comment.length} comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center my-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          value={text}
          onChange={changeEventHandler}
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADf8] text-sm cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default SinglePost;
