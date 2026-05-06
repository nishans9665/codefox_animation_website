const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const supabase = require('../supabase');
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
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Get all posts (including drafts)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
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
        const { data, error } = await supabase
            .from('posts')
            .insert([
                { title, slug, category, image: imagePath, content, status: status || 'draft' }
            ])
            .select();

        if (error) {
            if (error.code === '23505') { // Postgres unique violation code
                return res.status(400).json({ message: `Article with slug '${slug}' already exists. Please change the title.` });
            }
            throw error;
        }
        res.status(201).json({ message: 'Post created', id: data[0].id });
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

        const { error } = await supabase
            .from('posts')
            .update(updateData)
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Post updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin ONLY: Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
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
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', req.params.slug)
            .eq('status', 'published')
            .single();

        if (error || !post) return res.status(404).json({ message: 'Post not found' });

        await supabase
            .from('posts')
            .update({ views: (post.views || 0) + 1 })
            .eq('id', post.id);

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

