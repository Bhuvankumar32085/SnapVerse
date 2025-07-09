import React from "react";
import SinglePost from "./SinglePost";
import { useSelector } from "react-redux";

function Post() {
  const {posts}=useSelector(store=>store.post)
  return (
    <div>
      {posts.map((post) => (
        <SinglePost post={post} key={post._id} />
      ))}
    </div>
  );
}

export default Post;
