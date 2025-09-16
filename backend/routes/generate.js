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



router.post('/report', protect, async (req, res) => { 
    console.log('Request received at HYBRID /api/generate/report');
    const { base64Image, mimeType, location, language, yoloBreed } = req.body;

    if (!base64Image || !mimeType) {
        return res.status(400).json({ error: 'Image data is missing.' });
    }

    try {
        const imagePart = { inlineData: { data: base64Image, mimeType: mimeType } };
        let yoloHint = `My custom vision model has detected the breed as '${yoloBreed}'. Please verify this detection. If you strongly agree, use this breed for the report. If you disagree, identify the correct breed.`;
        if (!yoloBreed) yoloHint = "My custom vision model did not provide an initial detection.";
        
        const textPart = `Analyze the provided image. Location: ${location}. Language for Advice: ${language}. CONTEXT: ${yoloHint}. Generate a complete Pashu Sahayak report. Ensure the output is a single, valid JSON object and nothing else.`;
        
        
        const result = await reportModel.generateContent([textPart, imagePart]);
        const report = JSON.parse(result.response.text());

        console.log('✅ Hybrid report generated successfully.');
        res.json(report);
    } catch (error) {
        console.error('❌ Error calling Google GenAI for report:', error);
        res.status(500).json({ error: 'Failed to generate AI report.' });
    }
});



router.post('/valuation', protect, async (req, res) => { 
    console.log('Request received at /api/generate/valuation');
    const inputs = req.body;

    try {
        const prompt = `Calculate the fair market value for a livestock animal with these characteristics:
        - Breed: ${inputs.breed}
        - Age: ${inputs.age} years
        - Peak Milk Yield: ${inputs.milkYield} liters/day
        - Health Condition: ${inputs.health}
        - Location: ${inputs.location}
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


<<<<<<< HEAD
// ROUTE 3: AI ASSISTANT
// backend/routes/generate.js

// ... (keep your other imports and model initializations at the top)

// Helper function to convert image data for Gemini
=======

>>>>>>> 0d0cc4a9fe94227d37c4a54287e2451c6c990d32
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

<<<<<<< HEAD
// --- REPLACE the existing '/assistant' route with this ---
router.post('/assistant', protect, async (req, res) => {
    console.log('Request received at /api/generate/assistant');
    // Now we expect message AND potentially an image
=======

router.post('/assistant', protect, async (req, res) => {
    console.log('Request received at /api/generate/assistant');
    
>>>>>>> 0d0cc4a9fe94227d37c4a54287e2451c6c990d32
    const { message, imageBase64, mimeType } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        let result;

<<<<<<< HEAD
        // Check if image data was sent with the message
        if (imageBase64 && mimeType) {
            // If yes, this is a multimodal request (image + text)
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            const imagePart = fileToGenerativePart(imageBuffer, mimeType);
            const promptParts = [message, imagePart]; // Send both text and image
            result = await assistantModel.generateContent(promptParts);
        } else {
            // If no, this is a text-only request
=======
        
        if (imageBase64 && mimeType) {
            
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            const imagePart = fileToGenerativePart(imageBuffer, mimeType);
            const promptParts = [message, imagePart]; 
            result = await assistantModel.generateContent(promptParts);
        } else {
            
>>>>>>> 0d0cc4a9fe94227d37c4a54287e2451c6c990d32
            result = await assistantModel.generateContent(message);
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