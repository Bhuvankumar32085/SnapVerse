import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID, // your gmail address
    pass: process.env.MAIL_PASS, //it is an app password generated from google account security settings
  },
});
