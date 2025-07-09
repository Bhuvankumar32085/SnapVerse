import dotenv from "dotenv";
dotenv.config();

import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateVerificationCode } from "../util/generateVerificationCode.js";
import bcrypt from "bcrypt";
import getDataUri from "../util/datauri.js";
import cloudinary from "../util/cloudinary.js";
import Post from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Somthing is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exists with this email",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    // save user
    let newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    //Generates a 6-digit number
    const verificationToken = generateVerificationCode().toString();
    // save OTP in otp schema
    const otp = await new OTP({
      email,
      otp: verificationToken,
    });
    await otp.save();

    // genrateToken()

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Somthing is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect emaul or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    const isPasswordMatsh = await bcrypt.compare(password, user.password);
    if (!isPasswordMatsh) {
      return res.status(401).json({
        success: false,
        message: "Incorrect emaul or password",
      });
    }

    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const populatePosts = await Promise.all(
      user.post.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    )
    
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: populatePosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  //Validate Input
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email or OTP is missing",
    });
  }

  try {
    //  Find matching OTP document
    const existingOtp = await OTP.findOne({ email, otp: otp.toString() });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Mark user as verified
    await User.updateOne({ email }, { $set: { isVerified: true } });
    // Get user again after update
    const verifiedUser = await User.findOne({ email });

    // Send welcome email
    await sendWelcomeEmail(verifiedUser.email, verifiedUser.username);

    // 🧹 Clean up OTP after verification
    await OTP.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({path:'post', createdAt:-1}).populate('bookmarks');;
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender;
    }
    if (profilePicture) {
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any user",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const folloOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskeFollowKrunga = req.params.id;

    if (followKrneWala == jiskeFollowKrunga) {
      return res.status(400).json({
        success: false,
        message: "you can not follow/unfollow youself",
      });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskeFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const isFollowing = user.following.includes(jiskeFollowKrunga);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskeFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskeFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        success: true,
        message: "Unfollow successfully",
      });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskeFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskeFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        success: true,
        message: "follow successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
