import mongoose from "mongoose";
const { Schema } = mongoose;

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires after 5 mins
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
