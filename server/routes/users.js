const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/authMiddleware');

// Get all users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at');

        if (error) throw error;
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
        const { error } = await supabase
            .from('users')
            .insert([
                { name, email, password: hashedPassword, role: role || 'Editor' }
            ]);

        if (error) throw error;
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

        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', req.params.id);

        if (error) throw error;
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
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

