// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get details of the current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const currentUser = { ...req.user._doc, password: undefined };
        res.json(currentUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update details of the current user
router.put('/me', authMiddleware, async (req, res) => {
    const { username, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                username,
                email,
            },
            { new: true } // Return the updated user
        );

        // Exclude sensitive information like the password
        const updatedUserData = { ...updatedUser._doc, password: undefined };

        res.json(updatedUserData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update the password of the current user
router.put('/me/password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = req.user;
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid current password' });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Logout the current user

module.exports = router;
