// In file: backend/routes/generate.js

const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require('../middleware/authMiddleware.js');
require('dotenv').config();

const router = express.Router();

// This line handles either API key name from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

// Helper function to convert image data for Gemini
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

// --- All models are initialized once for better performance ---

const reportModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
const valuationModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

// UPDATED: System instruction is now more general, without the veterinary focus
const assistantModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an expert AI assistant for farmers in India named "Pashu Mitra AI". Provide helpful, safe, and practical advice on cattle and buffalo care, focusing on breed information, nutrition, and general well-being. If a user asks about a serious health issue, advise them to consult a qualified local veterinarian immediately. Keep answers concise and easy to understand.`
});


// ROUTE 1: HYBRID REPORT
router.post('/report', protect, async (req, res) => {
    console.log('Request received at /api/generate/report');
    const { base64Image, mimeType, location, language, yoloBreed } = req.body;

    if (!base64Image || !mimeType) {
        return res.status(400).json({ error: 'Image data is missing.' });
    }

    try {
        const imagePart = { inlineData: { data: base64Image, mimeType: mimeType } };
        let yoloHint = `My custom vision model has detected the breed as '${yoloBreed}'. Please verify this.`;
        if (!yoloBreed) yoloHint = "My custom vision model did not provide an initial detection.";
        
        // UPDATED: Prompt no longer asks for a veterinary report
        const textPart = `
            You are 'Pashu Sahayak AI', an expert AI for the Indian subcontinent. Your report MUST include ONLY:
            - "advanced_breed_detector": Accurately identify the primary cattle breed, its origin, history, and key physical identifiers. If you detect cross-breeding, identify secondary breeds.
            - "hyper_local_advisor": Provide detailed feeding, housing, and seasonal tips tailored to '${location}, India' in the ${language} language.
            CONTEXT: ${yoloHint}.
            Generate a complete report. Ensure the output is a single, valid JSON object and nothing else.
        `;
        
        const result = await reportModel.generateContent([textPart, imagePart]);
        const report = JSON.parse(result.response.text());

        console.log('✅ Hybrid report generated successfully.');
        res.json(report);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for report:', error);
        res.status(500).json({ error: 'Failed to generate AI report.' });
    }
});


// ROUTE 2: VALUATION
router.post('/valuation', protect, async (req, res) => {
    console.log('Request received at /api/generate/valuation');
    const inputs = req.body;
    try {
        const prompt = `Calculate the fair market value for a livestock animal with these characteristics:
        - Breed: ${inputs.breed}, Age: ${inputs.age} years, Peak Milk Yield: ${inputs.milkYield} liters/day, Health Condition: ${inputs.health}, Location: ${inputs.location}.
        Provide a realistic price range in INR and list the key valuation factors. The output must be a single, valid JSON object.`;
        
        const result = await valuationModel.generateContent(prompt);
        const valuation = JSON.parse(result.response.text());
        
        console.log('✅ Valuation generated successfully.');
        res.json(valuation);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for valuation:', error);
        res.status(500).json({ error: 'Failed to generate valuation.' });
    }
});


// ROUTE 3: AI ASSISTANT
router.post('/assistant', protect, async (req, res) => {
    console.log('Request received at /api/generate/assistant');
    const { message, imageBase64, mimeType } = req.body;

    // This check now allows image-only requests
    if (!message && !imageBase64) {
        return res.status(400).json({ error: 'A message or an image is required.' });
    }
    try {
        let result;
        // Use a default prompt if the message is empty but an image is present
        const prompt = message || "Describe this image in detail."; 
        
        if (imageBase64 && mimeType) {
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            const imagePart = fileToGenerativePart(imageBuffer, mimeType);
            result = await assistantModel.generateContent([prompt, imagePart]);
        } else {
            result = await assistantModel.generateContent(prompt);
        }
        
        const responseText = result.response.text();
        console.log('✅ AI Assistant response generated.');
        res.send(responseText);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for assistant:', error);
        res.status(500).json({ error: 'Failed to get AI assistant response.' });
    }
});

module.exports = router;