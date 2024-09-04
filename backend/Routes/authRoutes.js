const express = require('express');
const { signUp, signIn , logout } = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/logout', logout);

// Protected routes (example)
router.get('/verifyAuth', authenticateJWT, (req, res) => {
    res.status(200).json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
