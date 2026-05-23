const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const prisma = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Set up multer for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fieldSize: 50 * 1024 * 1024 } // allow 50MB for large base64 HTML content
});

// Public: Get all published posts
router.get('/', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { status: 'published' },
            orderBy: { created_at: 'desc' }
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Get all posts (including drafts)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { created_at: 'desc' }
        });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Create post
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, slug, category, content, status } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const post = await prisma.post.create({
            data: { title, slug, category, image: imagePath, content, status: status || 'draft' }
        });

        res.status(201).json({ message: 'Post created', id: post.id });
    } catch (error) {
        console.error('SERVER_ERROR_POST:', error);
        res.status(500).json({ message: 'Server error saving article', error: error.message });
    }
});

// Admin ONLY: Edit post
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, slug, category, content, status } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    try {
        const updateData = { title, slug, category, content, status };
        if (imagePath) updateData.image = imagePath;

        await prisma.post.update({
            where: { id: parseInt(req.params.id) },
            data: updateData
        });
        res.json({ message: 'Post updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.post.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Public: Get single post by slug and increment view count
router.get('/article/:slug', async (req, res) => {
    try {
        // Increment view count using rpc or manual update
        // Manual update for simplicity now (Note: not atomic like views = views + 1)
        const post = await prisma.post.findFirst({
            where: { slug: req.params.slug, status: 'published' }
        });

        if (!post) return res.status(404).json({ message: 'Post not found' });

        await prisma.post.update({
            where: { id: post.id },
            data: { views: { increment: 1 } }
        });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

