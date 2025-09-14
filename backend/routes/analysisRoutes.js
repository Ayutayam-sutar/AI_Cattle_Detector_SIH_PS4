// backend/routes/analysisRoutes.js
const express = require('express');
const Analysis = require('../models/Analysis.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// @route   GET /api/analyses
// @desc    Get logged-in user's analysis history
router.get('/', protect, async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/analyses
// @desc    Save a new analysis
router.post('/', protect, async (req, res) => {
    try {
        // Get all the data from the frontend
        const { image, location, analysisData, yoloData } = req.body;

        // Create a new analysis record using the flexible model
        const newAnalysis = new Analysis({
            user: req.user._id,
            image,
            location,
            reportData: analysisData, // Put the entire Gemini result here
            yoloData: yoloData       // Put the entire YOLO result here
        });

        const savedAnalysis = await newAnalysis.save();
        res.status(201).json(savedAnalysis);

    } catch (error) {
        console.error("ERROR SAVING ANALYSIS:", error); // Better logging
        res.status(500).json({ message: 'Server Error while saving analysis.', error: error.message });
    }
});


// --- ADD THIS NEW ROUTE ---
// @route   GET /api/analyses/:id
// @desc    Get a single analysis by its ID
router.get('/:id', protect, async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        // Security Check: Make sure the record belongs to the logged-in user
        if (analysis.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this record' });
        }

        res.json(analysis);
    } catch (error) {
        console.error(error);
        // Handle cases where the ID format is invalid
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Analysis not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;