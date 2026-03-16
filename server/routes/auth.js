import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        console.log("DEBUG [Register Request]:", req.body.email);
        const { name, email, password, role, subject, level, isClassTeacher, assignClass, assignSection, isExamDept } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please include all required fields (Name, Email, Password, Role).' });
        }

        // 1. Database Connection Check
        if (mongoose.connection.readyState !== 1) {
            console.error("CRITICAL: Database disconnected during signup attempt!");
            return res.status(503).json({ 
                message: 'Service Temporarily Unavailable: Database connection is not established.',
                state: mongoose.connection.readyState 
            });
        }

        // 2. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with that email already exists' });
        }

        // 3. Create user object
        const newUserData = {
            name,
            email,
            password,
            role,
            isExamDept: role === 'Exam Board Official' ? true : !!isExamDept
        };

        // Role-specific data mapping
        if (role === 'Teacher' || role === 'Class Teacher' || role === 'Exam Board Official') {
            newUserData.level = level || 'none';
        }
        if (role === 'Teacher' || role === 'Class Teacher') {
            newUserData.subject = subject;
        }
        if (role === 'Class Teacher') {
            newUserData.isClassTeacher = true;
            newUserData.assignClass = assignClass;
            newUserData.assignSection = assignSection;
        }

        console.log("DEBUG [Creating User]:", email);
        
        // 4. Attempt to save to DB
        let user;
        try {
            user = await User.create(newUserData);
    } catch (dbErr) {
            console.error("DEBUG [DB Save Error]:", {
                message: dbErr.message,
                name: dbErr.name,
                errors: dbErr.errors ? Object.keys(dbErr.errors) : 'none'
            });
            return res.status(400).json({ 
                message: 'Database Validation Error: ' + dbErr.message,
                details: dbErr.errors || null
            });
        }

        if (user) {
            console.log("SUCCESS [User Created]:", email);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isExamDept: user.isExamDept,
                level: user.level,
                subject: user.subject,
                isClassTeacher: user.isClassTeacher,
                assignClass: user.assignClass,
                assignSection: user.assignSection,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Unexpected failure during user creation.' });
        }
    } catch (error) {
        console.error("DEBUG [Register Exception]:", error);
        res.status(500).json({ 
            message: 'Server Exception: ' + error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        });
    }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials detected' });
        }
    } catch (error) {
        console.error("DEBUG [Login Exception]:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Server Exception: ' + error.message });
    }
});

export default router;
