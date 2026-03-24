const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const [projects] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, category, project_url } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !category || !imagePath) {
        return res.status(400).json({ message: 'Title, category, and image are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO projects (title, category, image, project_url) VALUES (?, ?, ?, ?)',
            [title, category, imagePath, project_url || '']
        );
        res.status(201).json({ message: 'Project created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, category, project_url } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    try {
        let query = 'UPDATE projects SET title=?, category=?, project_url=?';
        let params = [title, category, project_url || ''];
        
        if (imagePath) {
            query += ', image=?';
            params.push(imagePath);
        }
        
        query += ' WHERE id=?';
        params.push(req.params.id);

        await pool.query(query, params);
        res.json({ message: 'Project updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
