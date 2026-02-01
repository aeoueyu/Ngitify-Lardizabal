const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 

// Import Model
const User = require('../models/User'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Tinaasan ang limit para sa Profile Picture uploads (50mb)
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection (LOCAL)
mongoose.connect('mongodb://127.0.0.1:27017/ngitify') 
.then(() => console.log('✅ Connected to Local MongoDB'))
.catch((err) => console.error('❌ Error connecting to MongoDB:', err));

// ==========================================
// 📧 EMAIL CONFIGURATION (GAMIT ANG APP PASSWORD)
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'garciaaeiounicole@gmail.com',
        pass: 'czrjavoximyvctqf', // Ang iyong App Password
    },
});

// ================= ROUTES ================= //

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, role } = req.body; 
        const user = await User.findOne({ email });

        // 1. Check kung existing user
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        // 2. STRICT ROLE CHECK: Bawal mag-login ang Dentist sa Owner page, etc.
        if (role && user.role !== role) {
             return res.status(403).json({ message: "Access denied. You cannot log in here with your account type." });
        }

        // 3. Password Check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        // 4. Verification Check (Optional: Enable kung required na)
        // if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first." });

        const token = jwt.sign({ userId: user._id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        
        res.json({ 
            token, 
            role: user.role, 
            userId: user._id,
            isPasswordChanged: user.isPasswordChanged 
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// --- ACTIVATE ACCOUNT ---
app.post('/api/activate-account', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: "No token provided." });

        const user = await User.findOne({ activationToken: token });
        if (!user) return res.status(400).json({ message: "Invalid or expired activation link." });

        user.isVerified = true;
        user.activationToken = undefined; 
        await user.save();

        res.json({ message: "Account activated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error during activation." });
    }
});

// --- HELPER FUNCTION: SEND EMAIL ---
const sendActivationEmail = async (email, role, tempPassword, activationLink) => {
    const mailOptions = {
        from: '"NgitiFy Admin" <garciaaeiounicole@gmail.com>',
        to: email,
        subject: 'Welcome to NgitiFy! Activate Your Account',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #005466;">Welcome to NgitiFy!</h2>
                <p>Hello,</p>
                <p>Your <b>${role}</b> account has been successfully created.</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Temporary Password:</strong> <span style="font-size: 18px; font-weight: bold; color: #000;">${tempPassword}</span></p>
                </div>
                <p>Please click the button below to activate your account:</p>
                <a href="${activationLink}" style="background-color: #005466; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activate Account</a>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

// --- ADD DENTIST ---
// --- ADD DENTIST ---
app.post('/api/add-dentist', async (req, res) => {
    try {
        // Tanggalin natin ang destructuring ng specific fields para flexible
        // Ang req.body ay naglalaman na ng { name: {...}, address: {...} } galing sa frontend
        const { email, licenseNumber, ...otherData } = req.body;
        
        // 1. Check Email Duplicate
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ field: 'email', message: 'Email address is already registered.' });
        }

        // 2. Check License Number Duplicate
        if (licenseNumber) {
            const existingLicense = await User.findOne({ licenseNumber });
            if (existingLicense) {
                return res.status(409).json({ field: 'licenseNumber', message: 'License Number is already registered.' });
            }
        }

        // Generate Credentials
        const tempPassword = crypto.randomBytes(4).toString('hex'); 
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const activationToken = crypto.randomBytes(32).toString('hex');

        // DIRECT PASSING NG DATA (Dahil inayos na natin sa Frontend ang structure)
        const newUser = new User({
            email,
            licenseNumber,
            password: hashedPassword,
            role: 'dentist',
            isVerified: false, 
            activationToken,
            ...otherData // Ito ang magpapasa ng 'name', 'currentAddress', etc. ng buo
        });
        
        await newUser.save();

        // Send Email
        const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
        await sendActivationEmail(email, 'Dentist', tempPassword, activationLink);
        
        console.log(`✅ Dentist Added: ${email}`);
        res.status(201).json({ message: 'Dentist added successfully. Email sent.' });

    } catch (error) {
        console.error("Error adding dentist:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// --- ADD SECRETARY ---
app.post('/api/add-secretary', async (req, res) => {
    try {
        const { email, ...otherData } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ field: 'email', message: 'Email already exists.' });

        const tempPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const activationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            email, 
            password: hashedPassword,
            role: 'secretary',
            isVerified: false, 
            activationToken,
            ...otherData
        });
        await newUser.save();

        // Send Email
        const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
        await sendActivationEmail(email, 'Secretary', tempPassword, activationLink);

        console.log(`✅ Email sent to Secretary: ${email}`);
        res.status(201).json({ message: 'Secretary added successfully. Email sent.' });

    } catch (error) {
        console.error("Error adding secretary:", error);
        res.status(500).json({ message: "Server error or Email failed." });
    }
});

// --- ADD PATIENT ---
app.post('/api/add-patient', async (req, res) => {
    try {
        const { email, ...otherData } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ field: 'email', message: 'Email already exists.' });

        const tempPassword = crypto.randomBytes(4).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const activationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            email, 
            password: hashedPassword,
            role: 'patient',
            isVerified: false, 
            activationToken,
            ...otherData
        });
        await newUser.save();

        // Send Email
        const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
        await sendActivationEmail(email, 'Patient', tempPassword, activationLink);

        console.log(`✅ Email sent to Patient: ${email}`);
        res.status(201).json({ message: 'Patient added successfully. Email sent.' });

    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ message: "Server error or Email failed." });
    }
});

// --- GENERIC GET USERS ---
app.get('/api/users', async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) query.role = role;
        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) { res.status(500).json({ message: "Server error." }); }
});

// --- GENERIC GET SINGLE USER ---
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) { res.status(500).json({ message: "Server error." }); }
});

// --- GENERIC DELETE USER ---
app.delete('/api/user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted." });
    } catch (error) { res.status(500).json({ message: "Server error." }); }
});

// --- GENERIC UPDATE USER ---
// --- GENERIC UPDATE USER (With Email Re-Activation Logic) ---
app.put('/api/user/:id', async (req, res) => {
    try {
        const { password, email, ...updateData } = req.body;
        const userId = req.params.id;
        const currentUser = await User.findById(userId);
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        // Email Change Logic
        if (email && email !== currentUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(409).json({ message: "New email is already in use." });

            const tempPassword = crypto.randomBytes(4).toString('hex');
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            const activationToken = crypto.randomBytes(32).toString('hex');

            updateData.email = email;
            updateData.password = hashedPassword;
            updateData.activationToken = activationToken;
            updateData.isVerified = false;

            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
            const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
            await sendActivationEmail(email, currentUser.role, tempPassword, activationLink);

            return res.json({ message: "User updated. Re-activation email sent.", user: updatedUser });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { ...updateData, email }, { new: true });
        res.json(updatedUser);
    } catch (error) { res.status(500).json({ message: "Error updating user." }); }
});

// ... (Nasa taas ang existing codes mo) ...

// ==========================================
// 🔐 FORGOT PASSWORD & SETTINGS ROUTES
// ==========================================

// --- 1. SEND OTP (Forgot Password) ---
// --- 1. SEND OTP (Forgot Password) ---
app.post('/api/forgot-password', async (req, res) => {
    try {
        // FIX: Trim email to remove accidental spaces
        const email = req.body.email ? req.body.email.trim() : '';
        
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found." });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 Minutes validity

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = otpExpires;
        await user.save();

        // Send Email
        const mailOptions = {
            from: '"NgitiFy Security" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Password Reset Code - NgitiFy',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #005466; letter-spacing: 5px;">${otp}</h1>
                    <p>This code expires in 15 minutes.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to email." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// --- 2. VERIFY OTP ---
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ 
            email, 
            resetPasswordOtp: otp, 
            resetPasswordExpires: { $gt: Date.now() } // Check expiry
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP." });

        res.json({ message: "OTP Verified." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- 3. RESET PASSWORD (Forgot Password Flow) ---
app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        user.isPasswordChanged = true; // Mark as changed
        await user.save();

        res.json({ message: "Password reset successful." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- 4. CHANGE PASSWORD (Settings Flow) ---
app.post('/api/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found." });

        // Verify Current Password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password." });

        // Update to New Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isPasswordChanged = true;
        await user.save();

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// **IMPORTANT**: I-update mo ang User Model (`src/models/User.js`)
// Dagdagan mo ng fields na: `resetPasswordOtp`, `resetPasswordExpires`, `isPasswordChanged`

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));