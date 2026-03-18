const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to submit contact form
router.post('/', async (req, res) => {
    const { full_name, email, phone, subject, message } = req.body;
    try {
        await pool.query(
            'INSERT INTO contacts (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [full_name, email, phone || null, subject || null, message]
        );
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Get all contacts
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [contacts] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin ONLY: View single contact
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [contacts] = await pool.query('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
        if (contacts.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(contacts[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin ONLY: Delete contact
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
