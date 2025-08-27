// userRoutes.js
// routes/userRoutes.js
const express = require("express") 
const {totalUser,
     getlocation,
     searchUser, 
     followUser,
     sendConnectionRequest,
     getUserNotifications,
     getUserConnections,
     acceptConnectionRequest,
     unfollowUser } =  require("../controllers/userController.js");

const router = express.Router();

router.get("/total-users", totalUser)
router.get("/getlocation", getlocation);
router.get("/search", searchUser);
router.get("/followUser", followUser);
router.get('/connect', sendConnectionRequest)
router.get("/notifications", getUserNotifications);
router.get('/connections', getUserConnections)
router.get('/unfollowUser', unfollowUser)
router.get('/accept', acceptConnectionRequest)

module.exports =  router;