import { transporter } from "./mailtrap.js"; //our new SMTP transporter
import { generateWelcomeEmailHtml, htmlContent } from "./htmlEmail.js";

const FROM_EMAIL = '"Bhuvan-Social-Media-App" <no-reply@pateleats.com>';

export const sendVerificationEmail = async (email, otp) => {
  const html = htmlContent.replace("{verificationToken}", otp);

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email",
      html,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email verification");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const html = generateWelcomeEmailHtml(name);

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Bhuvan-Food-App",
      html,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send welcome email");
  }
};
