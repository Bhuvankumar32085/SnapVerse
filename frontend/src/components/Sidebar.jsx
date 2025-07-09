import React, { useState } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { CreatePost } from "@/CreatePost";
import { selectedPost, setPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function Sidebar({ close }) {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
   const { likeNotification } = useSelector(store => store.realTimeNotification);
  console.log("-----------", likeNotification);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://snapverse-lcwk.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(selectedPost(null));
        dispatch(setPost([]));
        // dispatch(setFollowOrUnFollow({}))
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createPostHandler = () => {
    setOpen(true);
  };

  const sidebarHandlet = (textType) => {
    if (textType == "Logout") logoutHandler();
    else if (textType == "Create") createPostHandler();
    else if (textType == "Profile") navigate(`profile/${user?._id}`);
    else if (textType == "Home") navigate(`/`);
    else if (textType == "Messages") navigate(`/chat`);
  };

  const sidebarItem = [
    { icon: <Home className="h-7 w-7" />, text: "Home" },
    // { icon: <Search className="h-7 w-7" />, text: "Search" },
    // { icon: <TrendingUp className="h-7 w-7" />, text: "Explore" },
    { icon: <MessageCircle className="h-7 w-7" />, text: "Messages" },
    { icon: <Heart className="h-7 w-7" />, text: "Notifications" },
    { icon: <PlusSquare className="h-7 w-7" />, text: "Create" },
    {
      icon: (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut className="h-7 w-7 text-red-500" />, text: "Logout" },
  ];

  return (
    <div className="h-full w-full p-4 relative bg-white space-y-6">
      {/*  Close Button - Only Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 md:hidden"
        onClick={close}
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="flex flex-col gap-4">
        <h4 className="ml-4 font-bold text-xl mt-2">LOGO</h4>
        {sidebarItem.map((item, index) => (
          <div
            key={index}
            // onClick={close}
            className="flex items-center gap-4 text-gray-700 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colorsn relative"
            onClick={() => sidebarHandlet(item.text)}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.text}</span>
            {item.text === "Notifications" && likeNotification?.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-700"
                  >
                    {likeNotification?.length}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    {likeNotification?.length == 0 ? (
                      <p>No New Notification</p>
                    ) : (
                      likeNotification.map((notification) => {
                        return (
                          <div
                            key={notification.userId}
                            className="flex items-center gap-2 my-2"
                          >
                            <Avatar>
                              <AvatarImage
                                src={notification.userDetails?.profilePicture}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">
                                {notification.userDetails?.username}
                              </span>{" "}
                              liked your post
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}
