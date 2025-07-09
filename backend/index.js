import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./util/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

server.listen(PORT, () => {
  connectDB()
    .then(() => {
      console.log("DB connect");
    })
    .catch((error) => {
      console.log("DB connect error");
    });
  console.log(`Server is listening at port: ${PORT}`);
});
