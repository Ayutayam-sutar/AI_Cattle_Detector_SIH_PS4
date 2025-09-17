// In file: backend/routes/generate.js

const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require('../middleware/authMiddleware.js');
require('dotenv').config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); 

const reportModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
const valuationModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
const assistantModel = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are an expert AI Veterinary Assistant for farmers in India named "Pashu Mitra AI". Provide helpful, safe, and practical advice on cattle and buffalo care. If the situation is serious, strongly advise consulting a qualified local veterinarian immediately. Keep answers concise and easy to understand. Start your response with "Pashu Mitra AI:".`
});

// Helper function to map language codes to full names
const languageMap = {
    'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'or': 'Odia',
    'mr': 'Marathi', 'ta': 'Tamil', 'te': 'Telugu'
};

// ROUTE 1: HYBRID REPORT
router.post('/report', protect, async (req, res) => {
    console.log('Request received at HYBRID /api/generate/report');
    const { base64Image, mimeType, location, yoloBreed } = req.body;

    // CHANGED: Use req.language from middleware as the primary source for language
    const targetLanguage = languageMap[req.language] || 'English';

    if (!base64Image || !mimeType) {
        return res.status(400).json({ error: req.t('imageDataMissing') }); // CHANGED
    }

    try {
        const imagePart = { inlineData: { data: base64Image, mimeType: mimeType } };
        let yoloHint = `My custom vision model has detected the breed as '${yoloBreed}'. Please verify this detection. If you strongly agree, use this breed for the report. If you disagree, identify the correct breed.`;
        if (!yoloBreed) yoloHint = "My custom vision model did not provide an initial detection.";
        
        // CHANGED: Use the dynamically determined targetLanguage
        const textPart = `Analyze the provided image. Location: ${location}. Language for Advice: ${targetLanguage}. CONTEXT: ${yoloHint}. Generate a complete Pashu Sahayak report. Ensure the output is a single, valid JSON object and nothing else.`;
        
        const result = await reportModel.generateContent([textPart, imagePart]);
        const report = JSON.parse(result.response.text());

        console.log('✅ Hybrid report generated successfully.');
        res.json(report);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for report:', error);
        res.status(500).json({ error: req.t('reportGenerationFailed') }); // CHANGED
    }
});


// ROUTE 2: VALUATION
router.post('/valuation', protect, async (req, res) => {
    console.log('Request received at /api/generate/valuation');
    const inputs = req.body;
    
    // CHANGED: Use req.language to determine the response language for valuation factors
    const targetLanguage = languageMap[req.language] || 'English';

    try {
        // CHANGED: Added instruction for language in the prompt
        const prompt = `Calculate the fair market value for a livestock animal with these characteristics:
        - Breed: ${inputs.breed}
        - Age: ${inputs.age} years
        - Peak Milk Yield: ${inputs.milkYield} liters/day
        - Health Condition: ${inputs.health}
        - Location: ${inputs.location}
        Provide a realistic price range in INR. List the key valuation factors in the ${targetLanguage} language. The output must be a single, valid JSON object.`;

        const result = await valuationModel.generateContent(prompt);
        const valuation = JSON.parse(result.response.text());
        
        console.log('✅ Valuation generated successfully.');
        res.json(valuation);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for valuation:', error);
        res.status(500).json({ error: req.t('valuationGenerationFailed') }); // CHANGED
    }
});


// ROUTE 3: AI ASSISTANT
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

router.post('/assistant', protect, async (req, res) => {
    console.log('Request received at /api/generate/assistant');
    const { message, imageBase64, mimeType } = req.body;

    // CHANGED: Get language for the assistant's response
    const targetLanguage = languageMap[req.language] || 'English';

    if (!message) {
        return res.status(400).json({ error: req.t('messageRequired') }); // CHANGED
    }

    try {
        let result;
        
        // CHANGED: Prepend language instruction to the user's message
        const messageWithLang = `Please respond to the following message in ${targetLanguage}. Message: "${message}"`;

        if (imageBase64 && mimeType) {
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            const imagePart = fileToGenerativePart(imageBuffer, mimeType);
            const promptParts = [messageWithLang, imagePart]; // Use the message with language instruction
            result = await assistantModel.generateContent(promptParts);
        } else {
            result = await assistantModel.generateContent(messageWithLang); // Use the message with language instruction
        }

        const responseText = result.response.text();

        console.log('✅ AI Assistant response generated.');
        res.send(responseText);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for assistant:', error);
        res.status(500).json({ error: req.t('assistantFailed') }); // CHANGED
    }
});

module.exports = router;