const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true },
        middle: { type: String },
        last: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['owner', 'dentist', 'staff', 'patient'], default: 'patient' },
    contactNumber: { type: String },
    
    // Address Fields
    currentAddress: { type: Object },
    permanentAddress: { type: Object },
    
    // Dentist Specifics
    birthdate: { type: Date },
    licenseNumber: { type: String },
    specialization: { type: String },
    profileImage: { type: String },

    // --- SECURITY FIELDS (BAGO) ---
    isVerified: { type: Boolean, default: false }, // Default is FALSE (Bawal mag-login)
    activationToken: { type: String },
    activationExpires: { type: Date } // Dito ilalagay ang 24-hour limit
    // -----------------------------
    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;