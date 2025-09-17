// In file: backend/server.js

// --- ADD THESE --- (For DB and environment variables)
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// --- KEEP THESE ---
const express = require('express');
const cors = require('cors');

// --- ADDED FOR TRANSLATION ---
const i18next = require('./i18n-backend');
const i18nextMiddleware = require('i18next-http-middleware');


// --- ADD THIS --- (Load environment variables from .env file)
dotenv.config();

// --- KEEP THESE --- (Import your existing routes)
const analyzeRoute = require('./routes/analyze');
const generateRoute = require('./routes/generate');
// --- ADD THIS --- (Import the new authentication routes)
const authRoutes = require('./routes/auth.js');
const analysisRoutes = require('./routes/analysisRoutes.js');

const app = express();
// --- CHANGE THIS --- (Use environment variable for port, default to 5000)
const port = process.env.PORT || 3001;

// --- Middleware (Cleaned up) ---
app.use(cors());
// This one line handles both JSON parsing and the size limit.
// The second app.use(express.json()) was redundant.
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
connectDB(); // Call the function to connect

// --- Using Routes ---

// --- ADD THIS --- (Use the new authentication routes)
// It's good practice to have auth routes listed first.
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes); // <-- ADD THIS
// --- KEEP THESE --- (Your existing routes)
app.use('/api/analyze', analyzeRoute);
app.use('/api/generate', generateRoute);


// --- Start the server --- (No changes here, just uses the new port variable)
app.listen(port, () => {
    console.log(`🚀 Node.js server listening at http://localhost:${port}`);
});