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
        res.status(500).json({ message: 'Server Error' });
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
        console.error("ERROR SAVING ANALYSIS:", error); 
        res.status(500).json({ message: 'Server Error while saving analysis.', error: error.message });
    }
});



router.get('/:id', protect, async (req, res) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        
        if (analysis.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this record' });
        }

        res.json(analysis);
    } catch (error) {
        console.error(error);
        
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Analysis not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;