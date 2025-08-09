const nodemailer = require('nodemailer');

// Utility to format time like "1:05 PM"
const formatTime = (date) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const sendOTP = async (email) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  const formattedTime = formatTime(otpExpires);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

const mailOptions = {
  from: `"Springs connect" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: '🔐 Your Springs connect Verification Code',
  html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: auto; background: #ffffff; padding: 30px; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); text-align: center;">
      
      <img src="http://localhost:5000/assets/logo.png" alt="Springs Connect Logo" style="width: 80px; height: auto; margin-bottom: 20px;" />

      <h2 style="color: #2C3E50; font-size: 24px; margin-bottom: 10px;">Welcome to Springs connect</h2>

      <p style="font-size: 15px; color: #555; margin-bottom: 20px;">
        We're excited to have you join our community. Use the code below to verify your account:
      </p>

      <div style="font-size: 32px; font-weight: bold; color: #2E86C1; letter-spacing: 4px; margin: 20px 0;">
        ${otpCode}
      </div>

      <p style="font-size: 14px; color: #444;">This code will expire at <strong>${formattedTime}</strong>.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 13px; color: #999;">Didn't request this? No worries — just ignore this email.</p>
    </div>
  `
};

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return { otpCode, otpExpires };
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw new Error('Failed to send OTP email.');
  }
};

module.exports = sendOTP;