// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const validateRegistration = require('../validators/validateRegistration');
const sendOTP = require('../utils/sendOtpEmail');

const registerUser = async (req, res) => {
  console.log('🔁 Received registration request:', req.body);

  const { isValid, errors } = validateRegistration(req.body);
  if (!isValid) return res.status(400).json({ errors });

  const {
    name, email, password, dob, gender,
    occupation, location, churchName, churchRole,
    interests, bio, prayerRequest, profilePicUrl
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: { email: 'Email already exists' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { otpCode, otpExpires } = await sendOTP(email);

    const user = new User({
      name, email, password: hashedPassword,
      dob, gender, occupation, location,
      churchName, churchRole, interests, bio, prayerRequest,
      profilePicUrl,
      currentCity: null,
      workplace: null,
      school: null,
      homeTown: null,
      relationshipStatus: null,
      otpCode,
      otpExpires,
      isVerified: false,
    });

    await user.save();
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📨 OTP for ${email}: ${otpCode}`);
    }

    res.status(201).json({
      message: 'User registered. Please enter the OTP sent to your email for verification.',
      userId: user._id,
    });
  } catch (err) {
    console.error('🚨 Registration error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


const resendOTP = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("❌ User ID is required to resend OTP");
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ User not found with ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      console.log(`❌ User already verified: ${userId}`);
      return res.status(400).json({ message: 'User already verified' });
    }
    const { otpCode, otpExpires } = await sendOTP(user.email);

    user.otpCode = otpCode;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`📨 OTP resent to ${user.email}: ${otpCode}`)
    return res.status(200).json({
      message: 'OTP resent successfully. Please check your email inbox.',
      otpExpires: otpExpires.toISOString()
    });
  }
  catch (err) {
    console.error(`🚨 Error resending OTP: ${err.message}`);
    return res.status(500).json({ message: 'Failed to resend OTP. Please try again later.' });
  }
}

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    console.log('🔁 Verifying OTP for user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      console.log('❌ User already verified');
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otpCode !== otp) {
      console.log(`❌ Invalid OTP: Expected ${user.otpCode}, Received ${otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < new Date()) {
      console.log(`⏰ OTP expired at ${user.otpExpires}, now is ${new Date()}`);
      return res.status(400).json({ message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    console.log('✅ OTP verified and user updated:', userId);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      user: userData,
      token,
      message: 'OTP verified successfully. You are now logged in.',
    });

  } catch (err) {
    console.error('🚨 Error during OTP verification:', err.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const loginUser = async (req, res) => {
  console.log(req.body)
  try {

    const { email, password } = req.body;

    console.log("📩 Incoming login request:", { email, password });

    // 1. Validate fields
    if (!email || !password) {
      console.log("⚠️ Missing fields:", {
        emailMissing: !email,
        passwordMissing: !password,
      });

      return res.status(400).json({
        success: false,
        errors: {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        },
      });
    }

    // 2. Check if user exists
    console.log("🔍 Checking user in DB...");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ User found:", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    // 3. Compare passwords
    console.log("🔐 Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Create JWT token
    console.log("🔑 Password matched. Generating token...");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 5. Prepare response
    const { password: _, ...userData } = user.toObject();

    console.log("🚀 Login successful. Sending response...");
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });

  } catch (err) {
    console.log("🚨 Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
};


const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (!allUsers) {
      console.log("no user avialable");
      return res.status(400).json({ message: "no user avialable" });
    }
    console.log("successfully gotten all users", allUsers);
    return res.status(400).json({data:allUsers, message: "successfully gotten all users" });
  }

  catch (err) {
    console.log("unable to fetch all user");
    return res.status(200).json({ message: "unable to fetch all user" })
  }
}

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      console.log('❌ User not found for deletion:', id);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('✅ User deleted successfully:', deletedUser._id);
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    console.log(`🗑️   Deleted ${result.deletedCount} users`);
    res.status(200).json({ message: `Deleted ${result.deletedCount} users` });
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production.' });
    }
  } catch (err) {
    console.error('🚨 Failed to delete users:', err);
    res.status(500).json({ error: 'Server error while deleting users' });
  }
};

const getImage = async (req, res) => {
  try {
    const imageUrl = req.file.path; // This is the Cloudinary URL
    console.log("✅ Image uploaded successfully:", imageUrl);
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.log("unable to upload image on cloundinary", err);
    res.status(500).json({ message: 'Image upload failed' });
  }
}
const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      console.log('Username is required')
      return res.status(400).json({ error: "Username is required" });
    }

    const existingUser = await User.findOne({ username: username.trim() });

    if (existingUser) {
      console.log("username already in use by someone else")
      return res.status(200).json({ exists: true, message: "Username already taken" });
    }
    console.log("username is vacant")
    return res.status(200).json({ exists: false, message: "Username is available" });
  } catch (err) {
    console.error("🚨 Error checking username:", err.message);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};
const updateUser = async (req, res) => {
  const { userId } = req.params;
  console.log("Updating user:", userId, "with data:", req.body);

  try {
    const allowedUpdates = [
      "username",
      "name",
      "email",
      "gender",
      "bio",
      "occupation",
      "location",
      "homeTown",
      "currentCity",
      "relationshipStatus",
      "school",
      "workplace",
      "churchName",
      "churchRole",
      "interests",
      "profilePicUrl",
    ];

    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "Email already in use" });
    }

    return res
      .status(500)
      .json({ message: "Server error: unable to update user" });
  }
};

module.exports = { registerUser, loginUser, verifyOTP, deleteAllUsers, deleteUserById, resendOTP, getImage, checkUsernameAvailability, updateUser, getAllUser };
