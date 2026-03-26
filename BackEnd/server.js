const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection check
const db = require('./config/db');

// Test route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Phone Store API" });
});

// Routes
const authRoutes = require('./routes/authRoutes');

app.use('/api', authRoutes);

// Static uploads folder
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
