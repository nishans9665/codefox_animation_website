const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const xss = require('xss-filters');
const rateLimit = require('express-rate-limit');

// Set up rate limiting
const contactSubmitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { errors: [{ msg: 'Too many requests from this IP, please try again after 15 minutes' }] }
});

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Public route to submit contact form
router.post('/',
    contactSubmitLimiter,
    [
        body('full_name').notEmpty().withMessage('Full name is required').trim(),
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('subject').notEmpty().withMessage('Subject is required').trim(),
        body('message').notEmpty().withMessage('Message is required').trim()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { full_name, email, phone, subject, message } = req.body;
        
        // Sanitize inputs
        const cleanName = xss.inHTMLData(full_name);
        const cleanEmail = xss.inHTMLData(email);
        const cleanPhone = xss.inHTMLData(phone || '');
        const cleanSubject = xss.inHTMLData(subject);
        const cleanMessage = xss.inHTMLData(message);

        try {
            await pool.query(
                'INSERT INTO contacts (full_name, email, phone, subject, message, is_read) VALUES (?, ?, ?, ?, ?, ?)',
                [cleanName, cleanEmail, cleanPhone || null, cleanSubject, cleanMessage, false]
            );

            // Send Email to Admin
            const adminMailOptions = {
                from: process.env.SMTP_FROM || 'noreply@codefoxit.com',
                to: process.env.ADMIN_EMAIL || 'admin@codefoxit.com',
                subject: `New Contact Form Submission: ${cleanSubject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px;">
                        <h2 style="color: #ff8a00;">New Contact Form Submission</h2>
                        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <tr><td style="padding: 10px; border-bottom: 1px solid #ccc;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ccc;">${cleanName}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #ccc;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ccc;">${cleanEmail}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #ccc;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ccc;">${cleanPhone}</td></tr>
                            <tr><td style="padding: 10px; border-bottom: 1px solid #ccc;"><strong>Subject:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ccc;">${cleanSubject}</td></tr>
                            <tr><td style="padding: 10px;"><strong>Message:</strong></td><td style="padding: 10px;">${cleanMessage.replace(/\n/g, '<br/>')}</td></tr>
                        </table>
                    </div>
                `
            };

            // Send Confirmation Email to User
            const userMailOptions = {
                from: process.env.SMTP_FROM || 'hello@codefoxit.com',
                to: cleanEmail,
                subject: `We received your message: ${cleanSubject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #ff8a00;">Hi ${cleanName},</h2>
                        <p>Thank you for reaching out! We have received your message regarding <strong>${cleanSubject}</strong>.</p>
                        <p>Our team will review it and get back to you within 24 hours.</p>
                        <br/>
                        <p>Best regards,<br/><strong>CodeFox Team</strong></p>
                    </div>
                `
            };

            // Attempt to send emails (catch errors quietly so form submission still succeeds for user)
            try {
                if (process.env.SMTP_HOST) {
                    await transporter.sendMail(adminMailOptions);
                    await transporter.sendMail(userMailOptions);
                } else {
                    console.log('Skipping email delivery. Please configure SMTP settings in .env');
                }
            } catch (err) {
                console.error('Email sending failed:', err);
            }

            res.status(201).json({ message: 'Message sent successfully' });
        } catch (error) {
            console.error('Submit error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

// Admin ONLY: Get all contacts with pagination & search
router.get('/', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search ? `%${req.query.search}%` : '%';

        const [contacts] = await pool.query(
            'SELECT * FROM contacts WHERE full_name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [search, search, limit, offset]
        );

        const [[{ total }]] = await pool.query(
            'SELECT COUNT(*) as total FROM contacts WHERE full_name LIKE ? OR email LIKE ?',
            [search, search]
        );

        res.json({
            data: contacts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Fetch error:', error);
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

// Admin ONLY: Mark contact as read/unread
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const { is_read } = req.body;
        await pool.query('UPDATE contacts SET is_read = ? WHERE id = ?', [is_read, req.params.id]);
        res.json({ message: 'Status updated successfully' });
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
