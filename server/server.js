import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger for Debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-seating')
    .then(() => console.log('✅ Connected to MongoDB Workspace'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);

// Base route
app.get('/api', (req, res) => {
    res.json({ message: 'Exam Seating System API Serverless is active.', status: 'healthy', timestamp: new Date() });
});

/*
// Diagnostic Catch-all for API to see if anything leaks
app.all('/api/(.*)', (req, res) => {
    console.warn(`[DIAGNOSTIC] ${req.method} ${req.url} was NOT handled by specific routes.`);
    res.status(404).json({ error: 'Route not found at API level', method: req.method, path: req.url });
});
*/

// Conditionally start server if running locally, otherwise export for Vercel Serverless
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Dedicated Monolithic Server initialized on port ${PORT}`);
    });
}

// Export for Vercel Serverless mapping
export default app;
