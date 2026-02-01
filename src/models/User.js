const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true },
        middle: { type: String },
        last: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for patients initially if generated
    // UPDATE: 'staff' becomes 'secretary'
    role: { type: String, enum: ['owner', 'dentist', 'secretary', 'patient'], default: 'patient' },
    contactNumber: { type: String },
    
    currentAddress: { type: Object },
    permanentAddress: { type: Object },
    
    birthdate: { type: Date },
    age: { type: Number }, // Helper field
    
    // Dentist/Secretary Specifics
    licenseNumber: { type: String },
    specialization: { type: String },
    
    // PATIENT SPECIFICS
    guardian: {
        name: { type: String },
        relationship: { type: String },
        contactNumber: { type: String }
    },
    medicalHistory: {
        allergies: { type: [String] }, // e.g., ['Latex', 'Penicillin']
        conditions: { type: [String] }, // e.g., ['High Blood Pressure', 'Diabetes']
        surgeries: { type: String },
        medications: { type: String },
        hospitalized: { type: String }, // "Yes - Reason" or "No"
        pregnant: { type: Boolean } // For female patients
    },

    profileImage: { type: String },

    // Security
    isVerified: { type: Boolean, default: false },
    activationToken: { type: String },
    activationExpires: { type: Date }
    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;