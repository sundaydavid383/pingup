const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { registerUser,
    loginUser,
    verifyOTP, deleteAllUsers,
    deleteUserById, resendOTP,
    uploadImage,
    checkUsernameAvailability,
    updateUser,
    getAllUser
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser)
router.post('/verify-otp', verifyOTP);
router.post("/resend-otp", resendOTP);
router.delete('/delete-all-users', deleteAllUsers);
router.delete('/delete-user/:id', deleteUserById);
router.get('/check-username/:username', checkUsernameAvailability)
router.put('/update/user/:userId', updateUser);
router.get('/allusers', getAllUser);
router.post('/upload-image', upload.single('profilePic'), uploadImage); // Assuming you have a getImage function to handle the image upload response
module.exports = router;