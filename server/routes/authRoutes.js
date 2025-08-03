const express = require('express');
const router = express.Router();
const {registerUser} = require('../controllers/auth/registerController');

router.post('/register', registerUser);

module.exports = router;