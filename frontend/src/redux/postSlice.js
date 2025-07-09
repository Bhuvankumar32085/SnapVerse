import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost:null
  },
  reducers: {
    // action
    setPost: (state, action) => {
      state.posts = action.payload;
      console.log("satate>post",state.posts)
    },
    selectedPost:(state,action)=>{
      state.selectedPost = action.payload;
      console.log("selectedPost>post",state.posts)
    }
  },
});

export const { setPost ,selectedPost} = postSlice.actions;
export default postSlice.reducer;
