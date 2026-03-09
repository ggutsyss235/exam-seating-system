import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import UserData from '../models/UserData.js';

const router = express.Router();

// @route   GET /api/data
// @desc    Get user's workspace data
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let data = await UserData.findOne({ user: req.user._id });

        // Initialize if first time
        if (!data) {
            data = await UserData.create({
                user: req.user._id,
                students: [],
                rooms: [],
                seatingPlan: null
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server synchronization failed' });
    }
});

// @route   PUT /api/data
// @desc    Sync user's workspace data
// @access  Private
router.put('/', protect, async (req, res) => {
    try {
        const { students, rooms, seatingPlan } = req.body;

        let data = await UserData.findOne({ user: req.user._id });

        if (data) {
            data.students = students !== undefined ? students : data.students;
            data.rooms = rooms !== undefined ? rooms : data.rooms;
            data.seatingPlan = seatingPlan !== undefined ? seatingPlan : data.seatingPlan;
            const updatedData = await data.save();
            res.json(updatedData);
        } else {
            // Shouldn't hit this if they fetched first, but just in case
            const newData = await UserData.create({
                user: req.user._id,
                students: students || [],
                rooms: rooms || [],
                seatingPlan: seatingPlan || null
            });
            res.status(201).json(newData);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to write to central database' });
    }
});

export default router;
