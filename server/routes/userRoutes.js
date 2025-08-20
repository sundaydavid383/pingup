// userRoutes.js
// routes/userRoutes.js
const express = require("express") 
const { searchUser } =  require("../controllers/userController.js");

const router = express.Router();

router.get("/search", searchUser);

module.exports =  router;