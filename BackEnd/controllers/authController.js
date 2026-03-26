const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { username, password, email, full_name, role_id } = req.body;

        // Check user exists
        const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.execute(
            'INSERT INTO users (username, password, email, full_name, role_id) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, email, full_name, role_id || 3] // Default to 'User' role
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user and join with roles
        const [users] = await db.execute(
            'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role_name
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
