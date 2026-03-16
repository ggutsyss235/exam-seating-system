import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { sendOTPEmail } from '../utils/email.js';

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
        const { name, email, password, role, subject, level, isClassTeacher, assignClass, assignSection } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please include all required fields.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with that email already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUserData = {
            name, email, password, role,
            otp, otpExpires,
            isVerified: false,
            isExamDept: role === 'Exam Board Official'
        };

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

        await User.create(newUserData);
        await sendOTPEmail(email, otp);

        res.status(201).json({ message: 'OTP sent to email. Please verify to complete registration.' });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server Exception: ' + error.message });
    }
});

// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true;
        await user.save();

        res.json({
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
    } catch (error) {
        res.status(500).json({ message: 'Verification failed: ' + error.message });
    }
});

// @route   POST /api/auth/resend-otp
// @access  Public
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOTPEmail(email, otp);
        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            await sendOTPEmail(email, otp);
            res.json({ message: 'OTP sent to email. Please verify to login.' });
        } else {
            res.status(401).json({ message: 'Invalid credentials detected' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Exception: ' + error.message });
    }
});

export default router;
