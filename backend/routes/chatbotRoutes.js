// chatbotRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Ollama API Configuration
const OLLAMA_API_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llava:7b-v1.6-mistral-q4_K_M";

// The API Endpoint: POST /api/chatbot/vet-assistant
// Note: The '/api/chatbot' part will be defined in server.js
router.post('/vet-assistant', async (req, res) => {
    try {
        const { message, imageBase64 } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        console.log(`Received message for Vet Assistant: "${message}"`);

        let requestPayload = {
            model: OLLAMA_MODEL,
            prompt: message,
            stream: false,
        };

        if (imageBase64) {
            console.log("Image data received.");
            requestPayload.images = [imageBase64];
        }

        console.log("Forwarding request to Ollama...");
        const ollamaResponse = await axios.post(OLLAMA_API_URL, requestPayload);
        console.log("Received response from Ollama.");

        res.json({ reply: ollamaResponse.data.response });

    } catch (error) {
        console.error("Error in vet-assistant route:", error.message);
        res.status(500).json({ error: 'Failed to get response from AI model.' });
    }
});

module.exports = router;