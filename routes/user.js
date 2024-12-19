const express = require('express');
const User = require('../models/User'); // Import User model
const router = express.Router();

// Sample GET route
router.get('/', (req, res) => {
    res.send('Welcome to the Node.js API!');
});

// Sample POST route to create a user
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Sample GET route to fetch users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;