const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const { 
    registerUser,
    loginUser,
    getUserProfile
    } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getUserProfile);

module.exports = router;