// userRoutes.js
// routes/userRoutes.js
const express = require("express") 
const {getlocation, searchUser, followUser, unfollowUser } =  require("../controllers/userController.js");

const router = express.Router();

router.get("/getlocation", getlocation);
router.get("/search", searchUser);
router.get("/followUser", followUser)
router.get('/unfollowUser', unfollowUser)

module.exports =  router;