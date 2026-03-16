import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Safe dotenv initialization
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        dotenv.config({ path: path.resolve(__dirname, '.env'), silent: true });
    } catch (e) {
        console.warn('Dotenv initialization skipped:', e.message);
    }
}

// Routes - Lazy imports or standard imports (standard is fine if they are robust)
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import aiRoutes from './routes/ai.js';
import pdfRoutes from './routes/pdf.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Request trace logger
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
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error('CRITICAL: MONGODB_URI is not defined in environment variables.');
        throw new Error('MONGODB_URI is missing');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
        console.log('✅ Connected to MongoDB Backend');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        throw err; 
    }
};

// Middleware to ensure DB connection for serverless invocations
// Exempting health checks from strict DB connection
app.use(async (req, res, next) => {
    if (req.url === '/api' || req.url === '/api/ping') {
        return next();
    }
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

// Health routes
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Exam Seating System API Serverless is active.', 
        status: 'healthy', 
        dbState: mongoose.connection.readyState,
        timestamp: new Date() 
    });
});

app.get('/api/ping', (req, res) => {
    res.json({ pong: true, uptime: process.uptime() });
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
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Monolithic Server initialized on 0.0.0.0:${PORT}`);
    });
}

export default app;
