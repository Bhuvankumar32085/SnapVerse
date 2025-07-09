import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res,next) => {
  try {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) {
      return res.status(401).json({
        message: "User is not Authenticated",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated