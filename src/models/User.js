const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    address: {
        region: String,
        province: String,
        city: String,
        brgy: String,
        houseNum: String,
        street: String
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    activationToken: String,
    otpCode: String,
});

module.exports = mongoose.model('User', userSchema);