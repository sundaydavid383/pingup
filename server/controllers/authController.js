// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const validateRegistration = require('../validators/validateRegistration');
const sendOTP = require('../utils/sendOtpEmail');

const registerUser = async (req, res) => {
        console.log("========================================");
        console.log("📝 New REGISTRATION attempt started...");
        console.log("========================================");

        try {
          console.log("📩 Step 1: Received registration request!");
          console.log("👉 Incoming data:", req.body);

          // 1. Validate registration input
          const { isValid, errors } = validateRegistration(req.body);
          if (!isValid) {
            console.log("❌ Step 1 Failed: Validation errors found!");
            console.log("   🚫 Errors:", errors);
            return res.status(400).json({ errors });
          }

          const {
            name, email, username, password, dob, gender,
            occupation, location, churchName, churchRole,
            interests, bio, prayerRequest, profilePicUrl,
            currentCity, country, latitude, longitude
          } = req.body;

           // 2. Check if user already exists
           console.log("🔍 Step 2: Checking if email is already registered...");
           const existingUser = await User.findOne({ email });
           if (existingUser) {
             console.log("❌ Step 2 Failed: Email already in use.");
             return res.status(400).json({ errors: { email: "Email already exists" } });
           }

          console.log("✅ Step 2 Success: Email is available!");

          // 3. Hash password
          console.log("🔐 Step 3: Securing password with hashing...");
          const hashedPassword = await bcrypt.hash(password, 10);
          console.log("   🔒 Password hashed successfully!");

          // 4. Generate OTP
          console.log("📨 Step 4: Generating OTP and sending to email...");
          const { otpCode, otpExpires } = await sendOTP(email);
          console.log("✅ OTP generated!");
          if (process.env.NODE_ENV !== "production") {
            console.log(`   🧾 OTP for ${email}: ${otpCode} (testing only)`);
          }

          // 5. Create new user
          console.log("🛠️ Step 5: Creating new user in the database...");
          const user = new User({
            name, email, username, password: hashedPassword,
            dob, gender, occupation, location,
            churchName, churchRole, interests, bio, prayerRequest,
            profilePicUrl,
            workplace: null,
            school: null,
            homeTown: null,
            relationshipStatus: null,
            otpCode,
            otpExpires,
            isVerified: false,

            ...(currentCity && country ? {currentCity, country} : {}),
            ...(latitude && longitude ?
              { locationCoords : {
              type: "Point",
              coordinates: [longitude, latitude],
            }}
             : {}),
          });

          await user.save();
          console.log("✅ Step 5 Success: User saved to database!");
          console.log("   👤 User ID:", user._id.toString());

          // 6. Respond to client
          console.log("🚀 Step 6: Registration completed!");
          console.log("   🎊 User must verify email with OTP to finish setup.");
          console.log("========================================\n");

          res.status(201).json({
            message: "User registered. Please enter the OTP sent to your email for verification.",
            userId: user._id,
          });

        } catch (err) {
  console.log("🚨 Unexpected ERROR during registration!");
  console.error("   ❌ Error details:", err);

  if (err.code === 11000) {
    // Handle duplicate key error gracefully
    const duplicateField = Object.keys(err.keyPattern)[0]; 
    const duplicateValue = err.keyValue[duplicateField];
    console.log(`   ⚠️ Duplicate ${duplicateField}: ${duplicateValue}`);

    return res.status(400).json({
      errors: { [duplicateField]: `${duplicateField} already exists` },
    });
  }

  res.status(500).json({ error: "Server error. Please try again later." });
}
};

// google register
const googleRegister = async (req, res) => {
  console.log("=== [googleRegister] Function invoked ===");

  try {
   
    console.log("[Step 1] Raw request body:", req.body);

    
    const { name, email, username, profilePicUrl, googleId } = req.body;
    console.log("[Step 2] Extracted values:", {
      name,
      email,
      username,
      profilePicUrl,
      googleId,
    });

    
    if (!email || !googleId) {
      console.warn("[Step 3] Validation failed: Missing required fields");
      return res.status(400).json({ message: "Email and Google ID are required" });
    }
    console.log("[Step 3] Validation passed: Required fields present");

    
    console.log(`[Step 4] Checking if user with email '${email}' exists...`);
    let user = await User.findOne({ email });

    if (!user) {
      console.log("[Step 4] No user found. Creating a new user...");

      user = new User({
        name,
        email,
        username,
        profilePicUrl,
        password: null, 
        isVerified: true, 
        googleId,
      });

      await user.save();
      console.log("[Step 4] New Google user created successfully:", user._id);
    } else {
      console.log("[Step 4] User already exists. Skipping creation:", user._id);
    }

    // 5. Generate JWT token
    console.log("[Step 5] Generating JWT token...");
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("[Step 5] Token generated successfully");

    // 6. Send response
    res.json({ user, token });
    console.log("[Step 6] Response sent to client with user + token");

  } catch (err) {
    // 7. Handle and log errors
    console.error("❌ [Error] Google Register failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }

  console.log("=== [googleRegister] Function execution completed ===\n");
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

    // 🔑 Use findById if userId = MongoDB _id
    const user = await User.findById(userId).select("+otpCode +otpExpires");

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

    if (user.otpExpires < Date.now()) {
      console.log(`⏰ OTP expired at ${user.otpExpires}, now is ${new Date()}`);
      return res.status(400).json({ message: 'OTP expired' });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    console.log('✅ OTP verified and user updated:', userId);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password, otpCode, otpExpires, ...userData } = user.toObject();

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
  console.log("========================================");
  console.log("🚀 New LOGIN attempt started...");
  console.log("========================================");

  try {
    // Step 1: Destructure body
    const { email, password, city, country, latitude, longitude } = req.body;

    console.log("📩 Step 1: Received login request!");
    console.log("   👉 Email entered:", email ? email : "❌ (missing)");
    console.log("   👉 Password entered:", password ? "✅ (provided)" : "❌ (missing)");
    console.log("   🌍 Location data received:", { city, country, latitude, longitude });

    if (!email || !password) {
      console.log("❌ Step 2: Missing email or password, sending 400...");
      return res.status(400).json({
        success: false,
        errors: {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        },
      });
    }

    // Step 3: Find user
    console.log("🔎 Step 3: Looking for user in database...");
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("❌ Step 3 FAILED: User not found!");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.log("✅ Step 3 SUCCESS: User found:", user);

    // Step 4: Compare passwords
    console.log("🔐 Step 4: Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Step 4 FAILED: Password mismatch!");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    console.log("✅ Step 4 SUCCESS: Password matched!");

    // Step 5: Update location fields
    console.log("📍 Step 5: Updating user location info...");
              if (city && country) {
          user.currentCity = city;
          user.country = country;
        }

        if (latitude && longitude) {
          user.locationCoords = {
            type: "Point",
            coordinates: [longitude, latitude],
          };
        }
    await user.save();
    console.log("✅ Step 5 SUCCESS: Location info updated!", user);

    // Step 6: Generate token
    console.log("🔑 Step 6: Generating JWT...");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("✅ Step 6 SUCCESS: Token generated!");

    // Step 7: Prepare response data
    const { password: _, ...userData } = user.toObject();
    console.log("📦 Step 7: Prepared response user data (password excluded).");

    // Final response
    console.log("🎉 LOGIN SUCCESSFUL! Sending response...");
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });

  } catch (err) {
    console.error("🚨 Unexpected ERROR during login!", err);
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
    return res.status(200).json({data:allUsers, message: "successfully gotten all users" });
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


const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = req.file.path; // Cloudinary public URL
    console.log("✅ Image uploaded successfully:", imageUrl);

    res.status(200).json({ url: imageUrl }); // use a single, consistent key
  } catch (err) {
    console.error("❌ Unable to upload image on Cloudinary:", err);
    res.status(500).json({ message: "Image upload failed", error: err.message });
  }
};


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
  console.log("🔵 Step 1: Received request to update user:", userId);
  console.log("📝 Request body data:", req.body);

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

    console.log("🔵 Step 2: Filtering allowed updates...");
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
        console.log(`✅ Allowed update added: ${key} =`, req.body[key]);
      } else {
        console.log(`⏩ Skipping key: ${key} (not in request)`);
      }
    }

    console.log("🔵 Step 3: Final updates object:", updates);

    console.log("🔵 Step 4: Attempting database update...");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.warn("⚠️ Step 5: No user found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Step 6: User updated successfully:", updatedUser);

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Step X: Update error occurred:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      console.error("❌ Duplicate email error:", error.keyValue);
      return res.status(400).json({ message: "Email already in use" });
    }

    return res
      .status(500)
      .json({ message: "Server error: unable to update user" });
  }
};

module.exports = { registerUser, 
  googleRegister,
   loginUser, 
  verifyOTP, deleteAllUsers,
   deleteUserById, resendOTP, 
  uploadImage, checkUsernameAvailability,
   updateUser, getAllUser };
