const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Set up multer for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Public: Get all published posts
router.get('/', async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts WHERE status = "published" ORDER BY created_at DESC');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin ONLY: Get all posts (including drafts)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin ONLY: Create post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, slug, category, content, status } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await pool.query(
            'INSERT INTO posts (title, slug, category, image, content, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, slug, category, imagePath, content, status || 'draft']
        );
        res.status(201).json({ message: 'Post created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Edit post
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, slug, category, content, status } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    try {
        let query = 'UPDATE posts SET title=?, slug=?, category=?, content=?, status=?';
        let params = [title, slug, category, content, status];
        
        if (imagePath) {
            query += ', image=?';
            params.push(imagePath);
        }
        
        query += ' WHERE id=?';
        params.push(req.params.id);

        await pool.query(query, params);
        res.json({ message: 'Post updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Public: Get single post by slug
router.get('/article/:slug', async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts WHERE slug = ? AND status = "published"', [req.params.slug]);
        if (posts.length === 0) return res.status(404).json({ message: 'Post not found' });
        res.json(posts[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
