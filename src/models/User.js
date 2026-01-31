const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Updated Name Structure (Mas maganda kaysa sa string lang na fullname)
    name: {
        first: { type: String, required: true },
        middle: { type: String },
        last: { type: String, required: true }
    },
    
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    birthdate: { type: Date }, // Added birthdate
    
    // Address Object
    currentAddress: {
        region: String, province: String, city: String, 
        brgy: String, street: String, houseNumber: String
    },
    permanentAddress: {
        region: String, province: String, city: String, 
        brgy: String, street: String, houseNumber: String
    },

    // Roles & Permissions
    role: { 
        type: String, 
        enum: ['owner', 'dentist', 'staff', 'patient'], 
        default: 'patient' 
    },

    // Dentist Specific Fields
    licenseNumber: { type: String },
    specialization: { type: String },
    profileImage: { type: String }, // Base64 string

    // Security
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    activationToken: String,
    otpCode: String,
}, { timestamps: true }); // Automatic na may createdAt at updatedAt

module.exports = mongoose.model('User', userSchema);