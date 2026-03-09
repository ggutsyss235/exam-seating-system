import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Conditionally start server if running locally, otherwise export for Vercel Serverless
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Dedicated Monolithic Server initialized on port ${PORT}`);
    });
}

// Export for Vercel Serverless mapping
export default app;
