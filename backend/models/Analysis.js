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

    
    reportData: { type: Object, required: true },

    
    yoloData: { type: Object, required: false },

}, { timestamps: true });

const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;