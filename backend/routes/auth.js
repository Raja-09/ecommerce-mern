// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtSecret = process.env.JWT_SECRET || 'default_secret'; // Use a default value if not set

// User registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// User login
// routes/auth.js
// ... (other imports)

// User login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
});
// ... (other routes)

router.post('/logout', async (req, res) => {
    const token = req.headers.authorization; // Assuming the token is sent in the Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        // Verify the token and extract its payload
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Add the token to the blacklist with its expiration time
        addToBlacklist(token, decodedToken.exp);

        res.json({ message: 'Token revoked successfully' });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
