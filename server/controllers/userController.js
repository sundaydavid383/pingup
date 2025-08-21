// controllers/userController.js
const User = require('../models/User');

// 🔍 SEARCH CONTROLLER
const searchUser = async (req, res) => {
  console.log("========================================");
  console.log("🔍 New USER SEARCH attempt started...");
  console.log("========================================");

  try {
    // 1. Extract search query + userId (for excluding self if needed)
    const { userId, query } = req.query; // e.g. /api/search?userId=123&query=David
    console.log("📩 Incoming params:", { userId, query });

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query cannot be empty" });
    }

    // 2. Build search filter (case-insensitive, partial match)
    const searchRegex = new RegExp(query, "i");

    let filter = {
      $or: [
        { name: searchRegex },
        { username: searchRegex },
       // { location: searchRegex },
       // { email: searchRegex },
      ],
    };

    // Exclude current user (optional)
    if (userId) {
      filter._id = { $ne: userId };
    }

    console.log("✅ Filter created:", filter);

    // 3. Query database
    const users = await User.find(filter)
      .select("-password -otpCode -passwordResetToken") // include email, exclude sensitive
      .limit(20);

    console.log(`✅ Found ${users.length} user(s)!`);

    // 4. Respond to client
    res.status(200).json({
      results: users,
      count: users.length,
    });

    console.log("🚀 Search completed successfully!");
    console.log("========================================\n");

  } catch (err) {
    console.log("🚨 Unexpected ERROR during user search!");
    console.error(err);
    console.log("========================================\n");

    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
// Follow User
const followUser = async (req, res) => {
  console.log("========================================");
  console.log("👥 [followUser] Follow attempt started...");
  console.log("========================================");

  try {
    // Extract user IDs
    const { userId, id } = req.query; // userId = current user, id = target user
    console.log("📩 Step 1: Incoming params ->", { userId, id });

    // 1. Prevent empty or invalid ids
    if (!userId || !id) {
      console.log("❌ Step 2: Missing userId or id");
      return res.status(400).json({ success: false, message: "Both userId and id are required" });
    }

    // 2. Prevent self-follow
    if (userId === id) {
      console.log("⚠️ Step 3: User tried to follow themselves");
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    console.log("✅ Step 3: Validation passed, fetching users...");

    // 3. Fetch users
    const user = await User.findById(userId);
    const toUser = await User.findById(id);

    console.log("📥 Step 4: Users fetched ->", { userFound: !!user, toUserFound: !!toUser });

    if (!user || !toUser) {
      console.log("❌ Step 4b: One or both users not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Check if already following
    console.log("🔍 Step 5: Checking if already following...");
    if (user.following.includes(id)) {
      console.log("⚠️ Step 5b: Already following this user");
      return res.json({ success: false, message: "You are already following this user" });
    }

    // 5. Update both users
    console.log("✍️ Step 6: Adding to following/followers...");
    user.following.addToSet(id); // avoids duplicates
    await user.save();
    console.log("✅ Step 6a: Saved current user (following updated)");

    toUser.followers.addToSet(userId);
    await toUser.save();
    console.log("✅ Step 6b: Saved target user (followers updated)");

    // 6. Success response
    console.log("🎉 Step 7: Follow action complete");
    res.json({
      success: true,
      message: "Now you are following this user",
      data: {
        followingCount: user.following.length,
        followersCount: toUser.followers.length,
      },
    });

  } catch (err) {
    console.log("🚨 Step ERROR: Unexpected exception in followUser!");
    console.error(err);
    console.log("========================================\n");

    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = { searchUser, followUser };