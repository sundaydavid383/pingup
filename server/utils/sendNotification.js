const nodemailer = require("nodemailer");
const User = require("../models/User");
// (optional) SMS service like Twilio
// const twilio = require("twilio");

async function sendNotification({ 
  userId, 
  type = "custom", 
  subject, 
  text 
}) {
  try {
    // 1. Find user
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // 2. Save notification to DB
    user.notifications.push({ type, text });
    await user.save();

    // 3. Email notification (if user wants email and has email address)
    if (user.notificationSettings?.email && user.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail", // or another SMTP
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
await transporter.sendMail({
  from: `"SpringsConnect" <${process.env.SMTP_EMAIL}>`,
  to: user.email,
  subject: subject,
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
      
      <!-- Logo -->
      <div style="text-align: center; padding: 20px; background-color: #e6f0fa;">
        <img src="https://res.cloudinary.com/dr0pxpbnj/image/upload/v1755452417/profile_pics/logo-1755452391046-4de60c87-0f58-433d-80c0-55abb6b8177b.png" 
             alt="Springs Connect Logo" 
             style="width: 80px; height: auto;" />
      </div>
      
      <!-- Greeting -->
      <div style="padding: 30px;">
        <h2 style="color: #1f3c88; font-size: 24px; margin-bottom: 10px;">Hello ${toUser.name},</h2>
        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
          You have received a new <strong>connection request</strong> from <strong>${user.name}</strong> on <span style="color: #1f3c88;">SpringsConnect</span>.
        </p>
        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
          Click the button below to view the request and manage your connections.
        </p>
        
        <!-- Call-to-Action Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.CLIENT_URL3}connections" 
             style="background-color: #1f3c88; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Connection Request
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 20px; text-align: center; background-color: #e6f0fa; font-size: 12px; color: #666666;">
        © ${new Date().getFullYear()} SpringsConnect. All rights reserved.
      </div>
    </div>
  </div>
  `
});

      console.log("📧 Email sent to:", user.email);
    }

    // 4. Phone/SMS notification (if user wants phone and has phone number)
    if (user.notificationSettings?.phone && user.phoneNumber) {
      // Example using Twilio (uncomment when you set it up)
      // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.messages.create({
      //   body: text,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: user.phoneNumber
      // });
      console.log("📱 SMS sent to:", user.phoneNumber);
    }

    return { success: true, message: "Notification sent successfully" };
  } catch (err) {
    console.error("❌ Error in sendNotification:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = sendNotification;
