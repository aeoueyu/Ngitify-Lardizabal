const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Import User Model
const User = require('../models/User.js'); 

const app = express();

// INCREASE SIZE LIMIT: Importante ito para sa Image Upload (50mb)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// --- DATABASE CONNECTION (LOCAL MONGODB) ---
// Siguraduhin na naka-open ang MongoDB Compass o tumatakbo ang mongod
const uri = "mongodb://127.0.0.1:27017/ngitify";

mongoose.connect(uri)
    .then(() => console.log('✅ Connected to LOCAL MongoDB (ngitify)'))
    .catch(err => console.error('❌ Database connection error:', err));

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'garciaaeiounicole@gmail.com', // Siguraduhin na tama ang App Password mo dito
        pass: 'igahrcpmubbnpzpt'
    }
});

// ======================= ROUTES =======================

// 1. ADD DENTIST (Admin/Owner Only)
app.post('/api/add-dentist', async (req, res) => {
    try {
        const { 
            firstName, middleName, lastName, 
            email, phone, birthdate, 
            licenseNumber, specialization, 
            currentAddress, permanentAddress,
            password, profileImage 
        } = req.body;

        // Check duplicate email
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists.' });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newDentist = new User({
            name: {
                first: firstName,
                middle: middleName,
                last: lastName
            },
            email,
            contactNumber: phone,
            birthdate,
            licenseNumber,
            specialization,
            currentAddress,   // Saved as object from frontend
            permanentAddress, // Saved as object from frontend
            profileImage,
            password: hashedPassword,
            role: 'dentist',    // IMPORTANT: Role is dentist
            isVerified: true    // Auto-verified kasi admin gumawa
        });

        await newDentist.save();

        // Send Email Credentials
        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Welcome to NgitiFy - Dentist Account Created',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #005466;">Welcome Dr. ${lastName}!</h1>
                    <p>Your dentist account has been successfully created.</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Initial Password:</strong> (The password set by the admin)</p>
                    <p>Please login to your dashboard to update your profile.</p>
                </div>
            `
        };
        transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Dentist account created successfully!' });

    } catch (error) {
        console.error("Error adding dentist:", error);
        res.status(500).json({ message: 'Server error adding dentist.' });
    }
});

// ... (sa ilalim ng app.post('/api/add-dentist' ...)

// GET ALL DENTISTS
app.get('/api/dentists', async (req, res) => {
    try {
        // Hanapin lahat ng user na 'dentist' ang role
        // Select lang natin yung mga kailangan na fields para mabilis
        const dentists = await User.find({ role: 'dentist' })
            .select('name licenseNumber email contactNumber isVerified profileImage');

        res.status(200).json(dentists);
    } catch (error) {
        console.error("Error fetching dentists:", error);
        res.status(500).json({ message: "Server error fetching dentists." });
    }
});

// ... (Sa ilalim ng app.get('/api/dentists' ...)

// DELETE DENTIST
app.delete('/api/dentist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Hanapin at Burahin ang user gamit ang ID
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error deleting user." });
    }
});

// ... (sa ilalim ng app.delete...)

// GET SINGLE DENTIST (For Editing)
app.get('/api/dentist/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE DENTIST
app.put('/api/dentist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            firstName, middleName, lastName, 
            email, phone, birthdate, 
            licenseNumber, specialization, 
            currentAddress, permanentAddress,
            password, profileImage 
        } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update Fields
        user.name.first = firstName;
        user.name.middle = middleName;
        user.name.last = lastName;
        user.email = email;
        user.contactNumber = phone;
        user.birthdate = birthdate;
        user.licenseNumber = licenseNumber;
        user.specialization = specialization;
        
        user.currentAddress = currentAddress;
        user.permanentAddress = permanentAddress;

        // Update Image only if provided
        if (profileImage) {
            user.profileImage = profileImage;
        }

        // Update Password only if provided (not empty)
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: "Dentist updated successfully" });

    } catch (error) {
        console.error("Error updating:", error);
        res.status(500).json({ message: "Server error updating dentist" });
    }
});

// ... (tuloy sa ibang routes)

// 2. PATIENT SIGNUP (Modified for new Schema)
app.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, contactNumber, address, password } = req.body;
    
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const activationToken = crypto.randomBytes(32).toString('hex');
    
        // Logic para hatiin ang Fullname sa First at Last name (dahil nagbago tayo ng schema)
        const nameParts = fullname.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';

        const newUser = new User({
            name: {
                first: firstName,
                middle: '',
                last: lastName
            },
            email,
            contactNumber,
            currentAddress: { street: address }, // Simpleng mapping muna
            password: hashedPassword,
            activationToken,
            role: 'patient' // Default role
        });
    
        await newUser.save();
    
        const activationUrl = `http://localhost:5000/api/activate/${activationToken}`;
        
        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Account Verification',
            html: `
                <h1>Welcome to NgitiFy!</h1>
                <p>Please click the link below to verify your email:</p>
                <a href="${activationUrl}">Verify Email</a>
            `
        };
    
        transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'User registered! Please check your email.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

// 3. ACTIVATE ACCOUNT
app.get('/api/activate/:token', async (req, res) => {
    try {
        const user = await User.findOne({ activationToken: req.params.token });
        if (!user) return res.status(400).send('Invalid or expired token.');

        user.isVerified = true;
        user.activationToken = undefined;
        await user.save();

        // Redirect to login page after success
        res.redirect('http://localhost:3000/login'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

// 4. LOGIN (Updated to return Role)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        // Generate OTP
        const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = loginOtp;
        await user.save();

        // Send OTP
        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Your Login OTP',
            html: `<h1>Your Login OTP is: <strong>${loginOtp}</strong></h1>`
        };
        transporter.sendMail(mailOptions);
        
        // Return Role para alam ng frontend kung saan pupunta
        res.status(200).json({ 
            message: "OTP sent", 
            email: email,
            role: user.role 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
});

// 5. VERIFY OTP
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otpCode !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.otpCode = undefined; // Clear OTP after use
        await user.save();

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// 6. RESEND OTP
app.post('/api/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = newOtp;
        await user.save();

        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Your New Login OTP',
            html: `<h1>Your New OTP is: <strong>${newOtp}</strong></h1>`
        };
        transporter.sendMail(mailOptions);

        res.status(200).json({ message: "New OTP sent" });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// 7. FORGOT PASSWORD
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Email not found" });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = code; 
        await user.save();

        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Password Reset Code',
            html: `<h1>Your Password Reset Code is: <strong>${code}</strong></h1>`
        };

        transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Verification code sent to email" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 8. VERIFY RESET CODE
app.post('/api/verify-reset-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otpCode !== code) {
            return res.status(400).json({ message: "Invalid code" });
        }
        
        // Huwag muna i-clear ang OTP dito kung gagamitin pa sa pag-reset ng password
        // Or pwede mag set ng flag
        res.status(200).json({ message: "Code verified" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 9. RESET PASSWORD
app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.otpCode = undefined; // Clear code now
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// START SERVER
app.listen(5000, () => console.log('✅ Server running locally on http://localhost:5000'));