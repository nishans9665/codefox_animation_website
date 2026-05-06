const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, category, project_url } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !category || !imagePath) {
        return res.status(400).json({ message: 'Title, category, and image are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([
                { title, category, image: imagePath, project_url: project_url || '' }
            ])
            .select();

        if (error) throw error;
        res.status(201).json({ message: 'Project created', id: data[0].id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, category, project_url } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    try {
        const updateData = { title, category, project_url: project_url || '' };
        if (imagePath) updateData.image = imagePath;
        
        const { error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Project updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

