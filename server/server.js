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
import pdfRoutes from './routes/pdf.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Request trace logger for Vercel debugging
app.use((req, res, next) => {
    console.log(`[TRACE] ${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection logic optimized for Serverless/Vercel
const mongoOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        console.log('Establishing new MongoDB connection...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-seating', mongoOptions);
        console.log('✅ Connected to MongoDB Backend (Atlas)');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        throw err; 
    }
};

// Initial connection for local monolithic mode
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    connectDB();
}

// Middleware to ensure DB connection for serverless invocations
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({ 
            message: 'Database Connection Failure',
            details: err.message 
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);

// Base health route
app.get('/api', (req, res) => {
    res.json({ message: 'Exam Seating System API Serverless is active.', status: 'healthy', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ 
        message: 'Internal Server Error: ' + err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// Conditionally start server if running locally
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Monolithic Server initialized on 0.0.0.0:${PORT}`);
    });
}

export default app;
