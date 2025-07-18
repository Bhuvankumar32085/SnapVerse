import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    OnlineUser: [],
    messages: [],
  },

  reducers: {
    setOnlineUser: (state, action) => {
      state.OnlineUser = action.payload;
      console.log("chat/slice", state.OnlineUser);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setOnlineUser, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
