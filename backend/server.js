// In file: backend/server.js


const mongoose = require('mongoose');
const dotenv = require('dotenv');


const express = require('express');
const cors = require('cors');

// --- ADDED FOR TRANSLATION ---
const i18next = require('./i18n-backend');
const i18nextMiddleware = require('i18next-http-middleware');


// --- ADD THIS --- (Load environment variables from .env file)
dotenv.config();


const analyzeRoute = require('./routes/analyze');
const generateRoute = require('./routes/generate');

const authRoutes = require('./routes/auth.js');
const analysisRoutes = require('./routes/analysisRoutes.js');

const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();

const port = process.env.PORT || 3001;


app.use(cors());

app.use(express.json({ limit: '10mb' }));

// --- ADDED FOR TRANSLATION ---
// This middleware detects the language and provides the req.t() function to your routes
app.use(i18nextMiddleware.handle(i18next));


// --- ADD THIS --- (Database Connection Logic)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully!');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};
connectDB(); 


app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes); 
app.use('/api/analyze', analyzeRoute);
app.use('/api/generate', generateRoute);

app.use('/api/chatbot', chatbotRoutes);



app.listen(port, () => {
    console.log(`🚀 Node.js server listening at http://localhost:${port}`);
});