// In file: backend/routes/analyze.js

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Configure Multer for file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the /api/analyze endpoint
router.post('/', upload.single('image'), async (req, res) => {
    console.log('Request received at /api/analyze');
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided.' });
    }

    const pythonApiUrl = 'http://127.0.0.1:5000/predict';

    try {
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        console.log('Forwarding image to Python service...');
        const response = await axios.post(pythonApiUrl, formData, {
            headers: { ...formData.getHeaders() },
        });

        console.log('✅ Analysis successful. Sending results to frontend.');
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error calling Python API:', error.message);
        res.status(500).json({ error: 'Failed to analyze image.' });
    }
});

module.exports = router;