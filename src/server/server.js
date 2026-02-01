const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Import Model
const User = require('../models/User'); // Siguraduhing tama ang path

const app = express();
const PORT = process.bin || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://ngitify:123@cluster0.on1ll.mongodb.net/ngitify?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ngitify@gmail.com', // Palitan ng totoong email
        pass: 'your-app-password', // Palitan ng App Password
    },
});

// ================= ROUTES ================= //

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body; 

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        // Role Validation
        if (role && user.role !== role) {
             return res.status(403).json({ message: "Access denied. You cannot log in with this role." });
        }

        // Password Check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first." });

        const token = jwt.sign({ userId: user._id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        res.json({ token, role: user.role, userId: user._id });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// --- GENERIC GET USERS (Filter by Role) ---
// Gamitin ito para sa ManageDentists, ManageSecretaries, ManagePatients
app.get('/api/users', async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) query.role = role;

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching users." });
    }
});

// --- GENERIC GET SINGLE USER ---
// Gamitin sa View at Edit pages
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- GENERIC DELETE USER ---
// Gagana sa Dentist, Secretary, at Patient
app.delete('/api/user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found." });
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- GENERIC UPDATE USER ---
// Gagana sa pag-edit ng profile ng kahit sinong role
app.put('/api/user/:id', async (req, res) => {
    try {
        // Separate password from update data (handle password change separately usually)
        const { password, ...updateData } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user." });
    }
});

// --- ADD DENTIST ---
app.post('/api/add-dentist', async (req, res) => {
    try {
        const { email, password, ...otherData } = req.body;
        
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ field: 'email', message: 'Email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            email, password: hashedPassword,
            role: 'dentist',
            isVerified: false, activationToken,
            ...otherData
        });
        await newUser.save();

        // Send Email Logic Here...
        
        res.status(201).json({ message: 'Dentist added successfully.' });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- ADD SECRETARY ---
app.post('/api/add-secretary', async (req, res) => {
    try {
        const { email, password, ...otherData } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ field: 'email', message: 'Email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            email, password: hashedPassword,
            role: 'secretary',
            isVerified: false, activationToken,
            ...otherData
        });
        await newUser.save();

        // Send Email Logic Here...

        res.status(201).json({ message: 'Secretary added successfully.' });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- ADD PATIENT ---
app.post('/api/add-patient', async (req, res) => {
    try {
        const { email, password, ...otherData } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ field: 'email', message: 'Email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            email, password: hashedPassword,
            role: 'patient',
            isVerified: false, activationToken,
            ...otherData
        });
        await newUser.save();

        // Send Email Logic Here...

        res.status(201).json({ message: 'Patient added successfully.' });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));