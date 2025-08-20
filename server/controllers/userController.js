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
        { location: searchRegex },
        { email: searchRegex },
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

module.exports = { searchUser };