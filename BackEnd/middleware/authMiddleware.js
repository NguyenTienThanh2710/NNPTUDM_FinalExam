const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: "Require Admin Role!" });
    }
};

module.exports = { verifyToken, isAdmin };
