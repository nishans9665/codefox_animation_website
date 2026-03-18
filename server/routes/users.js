const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create user
router.post('/', authMiddleware, async (req, res) => {
    // Only Admin can create users
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });

    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'Editor']
        );
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user (including password if provided)
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        // Prevent Editors from editing other users
        if (req.user.role !== 'Admin' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        let query = 'UPDATE users SET name=?, email=?, role=?';
        let params = [name, email, role];

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password=?';
            params.push(hashedPassword);
        }

        query += ' WHERE id=?';
        params.push(req.params.id);

        await pool.query(query, params);
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
    // Prevent deleting oneself
    if (req.user.id === parseInt(req.params.id)) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
