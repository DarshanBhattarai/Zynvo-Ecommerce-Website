import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use another service like Mailgun, Outlook, etc.
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS, // your App Password (not regular Gmail password)
    },
  });

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code for Verification",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,

    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #222;">Email Verification - OTP Code</h2>
      <p>Hello,</p>
      <p>Thank you for registering. Use the following OTP code to verify your email address:</p>
      
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; background: #000; color: #fff; padding: 10px; text-align: center; border-radius: 4px;">
        ${otp}
      </div>

      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>

      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Your App. All rights reserved.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending OTP email:", err);
  }
};
