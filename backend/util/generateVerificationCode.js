import crypto from "crypto";

export const generateVerificationCode = () => {
  const code = crypto.randomInt(100000, 999999); // Generates a 6-digit number
  return code.toString();
};