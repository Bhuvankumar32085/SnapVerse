import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile.followers.includes(user?._id);
  const [activeTab, setActiveTab] = useState("posts");
  const dispatch = useDispatch();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.post : userProfile?.bookmarks;

  console.log("userProfile---->", userProfile);

  const folloeOrUnfollwHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/followorunfollw/${userProfile?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const isCurrentlyFollowing = userProfile.followers.includes(user._id);

        let updatedFollowers;

        if (isCurrentlyFollowing) {
          // 🧹 Remove current user from followers
          updatedFollowers = userProfile.followers.filter(
            (id) => id !== user._id
          );
        } else {
          // ➕ Add current user to followers
          updatedFollowers = [...userProfile.followers, user._id];
        }

        // 🧠 Update Redux userProfile state
        dispatch(
          setUserProfile({
            ...userProfile,
            followers: updatedFollowers,
          })
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex max-w-4xl justify-center mx-auto py-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>
                {userProfile?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    {/* <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button> */}
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      onClick={folloeOrUnfollwHandler}
                      variant="secondary"
                      className="h-8"
                    >
                      Unfollow
                    </Button>
                    <Link to={`/chat`}>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={folloeOrUnfollwHandler}
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.post.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>{" "}
                </Badge>
                {/* <span>🤯Hip Hop style</span>
                <span>🤯code with fun</span>
                <span>🤯DM for collaboration</span> */}
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab == "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab == "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes?.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
