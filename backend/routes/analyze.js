// In file: backend/routes/analyze.js

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/', upload.single('image'), async (req, res) => {
    console.log('Request received at /api/analyze');
    if (!req.file) {
        // CHANGED: Using translated error message
        return res.status(400).json({ error: req.t('noImageFile') });
    }

    // ADDED: Get the language from the i18next middleware
    const userLanguage = req.language || 'en'; // Default to 'en' if not detected

    const pythonApiUrl = 'http://127.0.0.1:5000/predict';

    try {
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // ADDED: Append the language code to the form data
        formData.append('language', userLanguage);

        console.log(`Forwarding image to Python service for language: ${userLanguage}...`);
        const response = await axios.post(pythonApiUrl, formData, {
            headers: { ...formData.getHeaders() },
        });

        console.log('✅ Analysis successful. Sending results to frontend.');
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error calling Python API:', error.message);
        // CHANGED: Using translated error message
        res.status(500).json({ error: req.t('analysisFailed') });
    }
});

module.exports = router;