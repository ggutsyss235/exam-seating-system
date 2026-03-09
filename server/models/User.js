import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Teacher', 'Class Teacher', 'Exam Board Official'],
        required: true
    },
    // Required fields for Teachers and Class Teachers
    subject: {
        type: String,
        required: function () { return this.role === 'Teacher' || this.role === 'Class Teacher'; }
    },
    level: {
        type: String,
        enum: ['PGT', 'TGT', 'PRT', 'Support Staff', 'none'], // none for non-teachers or if not applicable
        required: function () { return this.role === 'Teacher' || this.role === 'Class Teacher' || this.role === 'Exam Board Official'; }
    },
    // Class Teacher specific
    isClassTeacher: {
        type: Boolean,
        default: false
    },
    assignClass: {
        type: String,
        required: function () { return this.role === 'Class Teacher'; }
    },
    assignSection: {
        type: String,
        required: function () { return this.role === 'Class Teacher'; }
    },
    // Flag for general school exam dept
    isExamDept: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
