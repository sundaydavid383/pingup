const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {registerUser, loginUser, verifyOTP, deleteAllUsers, deleteUserById, resendOTP, getImage} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser)
router.post('/verify-otp', verifyOTP);
router.post("/resend-otp", resendOTP);
router.delete('/delete-all-users', deleteAllUsers);
router.delete('/delete-user/:id', deleteUserById);
router.post('/upload-image', upload.single('profilePic'), getImage); // Assuming you have a getImage function to handle the image upload response
module.exports = router;