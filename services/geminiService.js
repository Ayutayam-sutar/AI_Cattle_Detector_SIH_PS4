import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PASHU_SAHAYAK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    advanced_breed_detector: {
      type: Type.OBJECT,
      properties: {
        primary_breed: { type: Type.STRING, description: "The most likely breed identified from the image." },
        confidence_score: { type: Type.NUMBER, description: "A number between 0.95 and 1.00." },
        breed_origin: { type: Type.STRING, description: "The geographical region where the breed originated." },
        breed_formation: { type: Type.STRING, description: "A brief history of how the breed was developed, including cross-breeding details if applicable." },
        key_identifiers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 3-5 key physical characteristics used for identification." },
        secondary_breeds: {
          type: Type.ARRAY,
          description: "An array of potential secondary breeds if cross-breed influence is detected. Can be empty.",
          items: {
            type: Type.OBJECT,
            properties: {
              breed: { type: Type.STRING, description: "The name of the secondary breed." },
              confidence_score: { type: Type.NUMBER, description: "Confidence score for the secondary breed (0.0 to 1.0)." }
            },
            required: ['breed', 'confidence_score']
          }
        }
      },
      required: ['primary_breed', 'confidence_score', 'breed_origin', 'breed_formation', 'key_identifiers']
    },
    ai_veterinary_assistant: {
      type: Type.OBJECT,
      properties: {
        overall_health_status: { type: Type.STRING, enum: ['Good', 'Fair', 'Needs Attention'], description: "A single health category." },
        detailed_observations: {
          type: Type.ARRAY,
          description: "A list of specific, detailed visual observations about the animal's health.",
          items: {
            type: Type.OBJECT,
            properties: {
              area: { type: Type.STRING, description: "The category of the observation (e.g., 'Body Condition', 'Coat & Skin', 'Posture & Gait')." },
              observation: { type: Type.STRING, description: "The specific observation made." },
              status: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Concern'], description: "The assessment of the observation." }
            },
            required: ['area', 'observation', 'status']
          }
        },
        veterinary_recommendation: { type: Type.STRING, description: "A simple, actionable health tip for the farmer." }
      },
      required: ['overall_health_status', 'detailed_observations', 'veterinary_recommendation']
    },
    hyper_local_advisor: {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING, description: "The language requested for the advice." },
        feeding_tip: { type: Type.STRING, description: "A detailed, locally relevant feeding tip, written in a descriptive paragraph in the specified language." },
        housing_tip: { type: Type.STRING, description: "A detailed, locally relevant housing tip, written in a descriptive paragraph in the specified language." },
        seasonal_tip: { type: Type.STRING, description: "A detailed care tip relevant to the current season in the specified location, written in a descriptive paragraph in the specified language." }
      },
      required: ['language', 'feeding_tip', 'housing_tip', 'seasonal_tip']
    }
  },
  required: ['advanced_breed_detector', 'ai_veterinary_assistant', 'hyper_local_advisor']
};

const VALUATION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        estimated_market_value_inr: { type: Type.STRING, description: "An estimated price range in INR (e.g., '₹45,000 - ₹52,000')." },
        valuation_factors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 3-4 factors explaining the valuation based on the provided inputs." }
    },
    required: ['estimated_market_value_inr', 'valuation_factors']
};


export async function getPashuSahayakReport(base64Image, mimeType, location, language, yoloBreed) {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
  text: `Analyze the provided image and information.
  Location: ${location}
  Language for Advice: ${language}
  IMPORTANT CONTEXT: My custom vision model detected the breed as '${yoloBreed}'. Please verify this. If you strongly agree, use this breed for the report. If you disagree, identify the correct breed.
  Generate a complete report based on all available information. The entire response must be in the strict JSON format defined in the schema.`,
};

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: `You are 'Pashu Sahayak', an advanced AI agricultural expert for the Indian subcontinent, specifically designed to support the Rashtriya Gokul Mission (RGM). Your purpose is to provide a focused report from a single image. Your report MUST include the following components:
- Advanced Breed Detector: Accurately identify the primary cattle or buffalo breed. For this breed, you MUST provide its geographical origin, a brief history of its formation (e.g., cross-breeding details), and a list of its key physical identifiers. CRITICALLY, if you detect signs of cross-breeding, you MUST also identify potential secondary breeds and list them with a confidence score.
- AI Veterinary Assistant: Instantly assess animal health. You MUST provide a list of detailed, specific observations broken down by area (e.g., 'Body Condition', 'Coat & Skin', 'Posture & Gait'). Each observation must have a status: 'Positive', 'Neutral', or 'Concern'.
- Hyper-Local Advisor: Provide farmers with essential care information. For feeding, housing, and seasonal tips, you MUST provide DETAILED, DESCRIPTIVE, and ACTIONABLE advice in paragraph form, tailored to the specified location and language.
Based ONLY on the provided image and location, generate a comprehensive report in the required JSON format. DO NOT include market valuation in this report.`,
        responseMimeType: "application/json",
        responseSchema: PASHU_SAHAYAK_SCHEMA,
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (!result.advanced_breed_detector || !result.ai_veterinary_assistant) {
        throw new Error("Invalid response format from API.");
    }

    return result;

  } catch (error) {
    console.error("Error getting Pashu Sahayak report:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get report from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred during AI analysis.");
  }
}

export async function getLivestockValuation(inputs) {
    try {
        const prompt = `Calculate the fair market value for a livestock animal with the following characteristics:
        - Breed: ${inputs.breed}
        - Age: ${inputs.age} years
        - Peak Milk Yield: ${inputs.milkYield} liters/day
        - Health Condition: ${inputs.health}
        - Location: ${inputs.location}

        Provide the response in the strict JSON format defined in the schema, considering real-time market data for the specified location.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are a "Smart Livestock Valuator" AI for the Indian agricultural market. Your purpose is to calculate a fair and realistic market value for cattle and buffaloes by combining accurate breed identification with real-time market data. Analyze the provided animal characteristics and location to generate an estimated price range in INR and list the key factors that influenced your valuation.`,
                responseMimeType: "application/json",
                responseSchema: VALUATION_SCHEMA,
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error getting livestock valuation:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get valuation from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred during valuation.");
    }
}


// frontend/src/services/geminiService.js

// ... (keep your other service functions)

// Helper function to read a file and convert it to a base64 string
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // We only need the base64 part
    reader.onerror = error => reject(error);
});

// --- REPLACE the existing getAIAssistantResponse function with this ---
export const getAIAssistantResponse = async (message, imageObject) => {
    try {
        const storedUser = sessionStorage.getItem('cattle-classifier-user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user || !user.token) {
            throw new Error("Authentication token not found.");
        }

        let requestBody = { message };

        // If an image object exists, convert its file to base64 and add it to the request
        if (imageObject && imageObject.file) {
            const imageBase64 = await fileToBase64(imageObject.file);
            requestBody.imageBase64 = imageBase64;
            requestBody.mimeType = imageObject.file.type;
        }

        const response = await fetch('http://localhost:3001/api/generate/assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to get AI assistant response.');
        }

        const textResponse = await response.text();
        return textResponse;

    } catch (error) {
        console.error('❌ Error calling the Assistant backend service:', error);
        throw error;
    }
};

/**
 * ***************************************************************
 * NEW FUNCTION FOR YOLOv8 BREED DETECTION
 * ***************************************************************
 * This function sends an image file to your custom backend to get the 
 * breed detected by your trained YOLOv8 model.
 *
 * @param {File} imageFile The image file selected by the user from an input.
 * @returns {Promise<Object>} A promise that resolves to the detection result,
 * e.g., [{ breed: 'Gir', confidence: 0.91, ... }]
 */
export async function detectBreedWithYOLOv8(imageFile) {
  
  const endpoint = 'http://localhost:3001/api/analyze';

  
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    console.log("Sending image to YOLOv8 backend for breed detection...");
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData, 
    });

    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Breed detection failed on the server.');
    }

    const result = await response.json();
    console.log("✅ Breed detection successful:", result);
    return result;

  } catch (error) {
    console.error('❌ Error calling the YOLOv8 backend:', error);
    
    throw error;
  }
}