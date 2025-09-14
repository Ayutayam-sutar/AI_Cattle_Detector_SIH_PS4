// backend/models/Analysis.js

const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: { type: String, required: true },
    location: { type: String, required: true },

    // This single field will flexibly store the entire report from Gemini
    reportData: { type: Object, required: true },

    // This stores the result from your local YOLO model
    yoloData: { type: Object, required: false },

}, { timestamps: true });

const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;