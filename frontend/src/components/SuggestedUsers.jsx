import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-2">
        <h1 className="font-semibold text-gray-600">Suggested Users For You</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center gap-2 my-5">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>
                    {user?.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio && user.bio.trim() !== ""
                    ? user.bio.split(" ").slice(0, 2).join(" ") + "..."
                    : "Bio here..."}
                </span>
              </div>
            </div>
            <span className="cursor-pointer text-[#3BADF8] font-bold text-sm hover:text-[#3bacf8c6]">
              Follow
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
