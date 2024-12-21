const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import User model
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user data to request
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// Middleware for admin authentication
const authenticateAdmin = (req, res, next) => {
    authenticateUser(req, res, () => {
        if (req.user.role !== 1) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        next();
    });
};

// Route: Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ name: user.name, email: user.email, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route: Register
router.post('/register', async (req, res) => {
    const { name, email, password, address = '', role = 2 } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role, address });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ name: user.name, email: user.email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route: Get all users (Admins only)
router.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password from results
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route: Get user by ID (Authenticated users)
router.get('/users/:id', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 }); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route: Update user details (Authenticated users)
router.put('/users/:id', authenticateUser, async (req, res) => {
    try {
        const { name, address } = req.body;

        if (req.user.id !== req.params.id && req.user.role !== 1) {
            return res.status(403).json({ error: 'Access denied. You can only update your own details.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, address },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route: Delete user (Admins only)
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
