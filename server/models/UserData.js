import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    students: [{
        rollNumber: String,
        name: String,
        department: String,
        subject: String
    }],
    rooms: [{
        roomNumber: String,
        rows: Number,
        columns: Number,
        capacity: Number
    }],
    seatingPlan: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    }
}, { timestamps: true });

const UserData = mongoose.model('UserData', dataSchema);
export default UserData;
