import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    socket: null,
  },

  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
      console.log("socketio/slice", state.socket);
    },
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
