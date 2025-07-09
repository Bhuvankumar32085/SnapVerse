import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPost } from "@/redux/postSlice";

function CommentDialog({ open, setOpen }) {
  const dispatch = useDispatch();
  const seletedPost = useSelector((store) => store.post.selectedPost);
  const posts = useSelector((store) => store.post.posts);
  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (seletedPost) {
      setComment(seletedPost.comments);
    }
  }, [seletedPost]);

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://snapverse-lcwk.onrender.com/api/v1/post/${seletedPost._id}/comment`,
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
          p._id == seletedPost._id ? { ...p, comments: updatedCommentData } : p
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
  
    if (!seletedPost || !seletedPost.author) return null;//-------add new

  const changeEventHandler = (e) => {
    if (e.target.value.trim()) {
      console.log(posts);
      console.log(seletedPost);
      setText(e.target.value);
    } else {
      setText("");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={seletedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={seletedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {seletedPost.author.username}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4 ">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add comment..."
                  className="w-full outline-none border-gray-300 text-sm"
                  value={text}
                  onChange={changeEventHandler}
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
