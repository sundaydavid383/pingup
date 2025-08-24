// controllers/userController.js
const User = require('../models/User');
const Connection = require('../models/Connections')

// get user location
const getlocation = async (req, res) => {
  console.log("=== [getlocation] Function invoked ===");

  try {
    // 1. Log raw incoming request data
    console.log("[Step 1] Raw request query:", req.query);

    // 2. Extract values from query
    const { userId, currentCity, country, latitude, longitude } = req.query;
    console.log("[Step 2] Extracted values:", {
      userId,
      currentCity,
      country,
      latitude,
      longitude,
    });

    // 3. Validate input (check if userId is provided)
    if (!userId) {
      console.warn("[Step 3] Validation failed: No userId provided");
      return res.status(400).json({ message: "User ID is required" });
    }
    console.log("[Step 3] Validation passed: userId exists");

    // 4. Prepare the update object (only include fields that were actually provided)
    const updateFields = {};
    if (currentCity) updateFields.currentCity = currentCity;
    if (country) updateFields.country = country;
    if (latitude) updateFields.latitude = latitude;
    if (longitude) updateFields.longitude = longitude;

    console.log("[Step 4] Prepared update fields:", updateFields);

    // 5. Attempt to update the user in the database
    console.log(`[Step 5] Updating user with ID: ${userId}`);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    // 6. Check if user was found and updated
    if (!updatedUser) {
      console.warn(`[Step 6] No user found with ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("[Step 6] User found and updated successfully:", updatedUser);

    // 7. Send response back to client
    res.json({
      message: "Location updated successfully",
      user: updatedUser,
    });
    console.log("[Step 7] Response sent to client");

  } catch (err) {
    // 8. Catch and log any errors
    console.error("❌ [Error] Failed to update user location:", err.message);
    res.status(500).json({ message: "Server error" });
  }

  console.log("=== [getlocation] Function execution completed ===\n");
};

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

// Unfollow User
const unfollowUser = async (req, res) => {
  console.log("========================================");
  console.log("👥 [unfollowUser] Unfollow attempt started...");
  console.log("========================================");

  try {
    // Extract user IDs
    const { userId, id } = req.query; 
    // userId = current user, id = target user
    console.log("📩 Step 1: Incoming params ->", { userId, id });

    // 1. Prevent empty or invalid ids
    if (!userId || !id) {
      console.log("❌ Step 2: Missing userId or id");
      return res.status(400).json({
        success: false,
        message: "Both userId and id are required",
      });
    }

    // 2. Prevent self-unfollow
    if (userId === id) {
      console.log("⚠️ Step 3: User tried to unfollow themselves");
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    console.log("✅ Step 3: Validation passed, fetching users...");

    // 3. Fetch users
    const user = await User.findById(userId);
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      console.log("❌ Step 4: One or both users not found");
      return res.status(404).json({
        success: false,
        message: "User(s) not found",
      });
    }

    console.log("👤 Step 4: Users fetched successfully");
    console.log("   Current user (before update):", user.following);
    console.log("   Target user (before update):", toUser.followers);

    // 4. Update following/followers lists
    user.following = user.following.filter(followedId => followedId.toString() !== id);
    await user.save();
    console.log("✅ Step 5: Current user updated ->", user.following);

    toUser.followers = toUser.followers.filter(followerId => followerId.toString() !== userId);
    await toUser.save();
    console.log("✅ Step 6: Target user updated ->", toUser.followers);

    console.log("🎉 Step 7: Unfollow completed successfully!");
    console.log("========================================\n");

    res.json({ success: true, message: "You are no longer following this user" });

  } catch (err) {
    console.log("🚨 Step ERROR: Unexpected exception in unfollowUser!");
    console.error(err);
    console.log("========================================\n");
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Send Connection Request
const sendConnectionRequest = async (req, res) => {
  try {
    console.log("▶️ Step 1: Controller called with query:", req.query);

    const { userId, id } = req.query;

    if (!userId || !id) {
      console.log("⚠️ Step 2: Missing required params (userId or id).");
      return res.status(400).json({
        success: false,
        message: "userId and id are required",
      });
    }

    // Check if user has sent more than 20 connection requests in the last 24 hours
    console.log("▶️ Step 3: Checking connection requests in the last 24 hours...");
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const connectionRequests = await Connection.find({
      from_user_id: userId,
      created_at: { $gt: last24Hours },
    });

    console.log(`✅ Step 3: Found ${connectionRequests.length} requests in last 24h.`);

    if (connectionRequests.length >= 20) {
      console.log("❌ Step 4: User exceeded daily request limit.");
      return res.json({
        success: false,
        message: "You have sent more than 20 connection requests in the last 24 hours",
      });
    }

    // Check if users are already connected
    console.log("▶️ Step 5: Checking existing connection...");
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      console.log("✅ Step 6: No connection found. Creating new request...");
      await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      console.log("✅ Step 7: Connection request created successfully.");
      return res.json({
        success: true,
        message: "Connection request sent successfully",
      });
    }

    if (connection.status === "accepted") {
      console.log("❌ Step 8: Already connected to this user.");
      return res.json({
        success: false,
        message: "You are already connected to this user",
      });
    }

    console.log("ℹ️ Step 9: Connection already pending.");
    return res.json({
      success: false,
      message: "Connection request pending",
    });
  } catch (error) {
    console.log("🚨 Step ERROR: Unexpected exception in sendConnectionRequest!");
    console.error(error);
    console.log("========================================\n");

    res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
};




// Get User Connections
const getUserConnections = async (req, res) => {
  try {
    console.log("▶️ Step 1: Controller called with query:", req.query);

    // Extract query params
    const { userId, id } = req.query;

    if (!userId || !id) {
      console.log("⚠️ Step 2: Missing required params (userId or id).");
      return res.status(400).json({
        success: false,
        message: "userId and id are required",
      });
    }
    console.log("✅ Step 2: Params received -> userId:", userId, "id:", id);

    // Fetch user and populate connections, followers, following
    console.log("⏳ Step 3: Fetching user with populated fields...");
    const user = await User.findById(userId).populate(
      "connections followers following"
    );

    if (!user) {
      console.log("❌ Step 3b: No user found with that ID.");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("✅ Step 3c: User found ->", user._id.toString());

    // Extract arrays
    const connections = user.connections || [];
    const followers = user.followers || [];
    const following = user.following || [];

    console.log("📊 Step 4: User connections count ->", connections.length);
    console.log("📊 Step 4: User followers count ->", followers.length);
    console.log("📊 Step 4: User following count ->", following.length);

    // Find pending connections
    console.log("⏳ Step 5: Fetching pending connections...");
    const rawPendingConnections = await Connection.find({
      to_user_id: userId,
      status: "pending",
    }).populate("from_user_id");

    const pendingConnections = rawPendingConnections.map(
      (connection) => connection.from_user_id
    );

    console.log(
      "📊 Step 5: Pending connections count ->",
      pendingConnections.length
    );

    // Final response
    console.log("✅ Step 6: Sending response...");
    res.json({
      success: true,
      connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
    console.log("🚨 Step ERROR: Unexpected exception in getUserConnections!");
    console.error(error);
    console.log("========================================\n");

    res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  getlocation,
   searchUser, 
   followUser,
   unfollowUser,
  sendConnectionRequest,
  getUserConnections };