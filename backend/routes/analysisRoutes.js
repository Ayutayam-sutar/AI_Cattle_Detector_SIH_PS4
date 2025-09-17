// backend/routes/analysisRoutes.js
const express = require('express');
const Analysis = require('../models/Analysis.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();


router.get('/', protect, async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (error) {
        // CHANGED: Using translated error message
        res.status(500).json({ message: req.t('serverError') });
    }
});


router.post('/', protect, async (req, res) => {
    try {
        
        const { image, location, analysisData, yoloData } = req.body;

        
        const newAnalysis = new Analysis({
            user: req.user._id,
            image,
            location,
            reportData: analysisData, 
            yoloData: yoloData       
        });

        const savedAnalysis = await newAnalysis.save();
        res.status(201).json(savedAnalysis);

    } catch (error) {
        console.error("ERROR SAVING ANALYSIS:", error); // Better logging
        // CHANGED: Using translated error message
        res.status(500).json({ message: req.t('saveError'), error: error.message });
    }
});



router.get('/:id', protect, async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            // CHANGED: Using translated error message
            return res.status(404).json({ message: req.t('analysisNotFound') });
        }

        
        if (analysis.user.toString() !== req.user._id.toString()) {
            // CHANGED: Using translated error message
            return res.status(401).json({ message: req.t('notAuthorized') });
        }

        res.json(analysis);
    } catch (error) {
        console.error(error);
        
        if (error.kind === 'ObjectId') {
             // CHANGED: Using translated error message
             return res.status(404).json({ message: req.t('analysisNotFound') });
        }
        // CHANGED: Using translated error message
        res.status(500).json({ message: req.t('serverError') });
    }
});


module.exports = router;