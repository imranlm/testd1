const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        console.log('no token');
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        // Here, user will contain the payload with email and id
        req.user = user; // Store the payload data in req.user for use in other routes

        next();
    });
};

module.exports = {
    authenticateJWT
};
