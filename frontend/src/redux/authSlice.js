import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selecteduser: null,
    // isFollowing: {},
  },
  reducers: {
    // action
    setAuthUser: (state, action) => {
      state.user = action.payload;
      console.log("AuthUser>auth", state.user);
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
      console.log("suggestedUsers>auth", state.suggestedUsers);
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
      console.log("userProfile>auth", state.userProfile);
    },
    setSelectedUser: (state, action) => {
      state.selecteduser = action.payload;
      console.log("selecteduser>auth", state.selecteduser);
    },
    // setFollowOrUnFollow: (state, action) => {
    //   const { userId, type } = action.payload;
    //   state.isFollowing[userId] = type;
    //   console.log("isFollowing--->auth", state.isFollowing);
    // },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  // setFollowOrUnFollow,
} = authSlice.actions;
export default authSlice.reducer;
