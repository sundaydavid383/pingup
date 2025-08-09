const express = require("express");
const dotenv = require("dotenv");
const cron = require('node-cron');
const cors = require("cors");
const connectDB = require("./config/db");
const User = require('./models/User');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL3,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use('/assets', express.static('assets'));
// Delete unverified user after 3 days every night
const deleteUnverifiedUserAfter3Days = async () =>{
    try{
     const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
     
     const result = await User.deleteMany({ 
      isVerified: false,
      createdAt: { $lt: threeDaysAgo }
     });

     console.log(`✅ Deleted ${result.deletedCount} unverified records.`);
  } catch(err){
      console.log(`❌ Error deleting unverified users: ${err.message}`);
    }
}

cron.schedule('0 0 * * *', ()=>{
  try {
     deleteUnverifiedUserAfter3Days();
  } catch (error) {
    console.log(`❌ Error in cron job: ${error.message}`);
  }
});

// Root Test
app.get("/", (req, res) => {
  res.send("🌍 Social Media API is live...");
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Server not started due to DB connection error.", err.message);
  });