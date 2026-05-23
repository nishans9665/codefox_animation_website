const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, created_at: true }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create user
router.post('/', authMiddleware, async (req, res) => {
    // Only Admin can create users
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });

    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { name, email, password: hashedPassword, role: role || 'Editor' }
        });

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

        const updateData = { name, email, role };

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: updateData
        });

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
        await prisma.user.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

