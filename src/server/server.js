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
        user: 'garciaaeiounicole@gmail.com', // Palitan kung iba ang sender email
        pass: 'igahrcpmubbnpzpt'             // App Password
    }
});

// ======================= ROUTES =======================

// 1. ADD DENTIST (Admin/Owner Only)
// 1. ADD DENTIST (With Activation Link)
app.post('/api/add-dentist', async (req, res) => {
    try {
        const { 
            firstName, middleName, lastName, 
            email, phone, birthdate, 
            licenseNumber, specialization, 
            currentAddress, permanentAddress,
            password, profileImage 
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists.' });

        // 1. Generate Security Token & Expiry (24 Hours)
        const activationToken = crypto.randomBytes(32).toString('hex');
        const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create User
        const newDentist = new User({
            name: { first: firstName, middle: middleName, last: lastName },
            email, contactNumber: phone, birthdate,
            licenseNumber, specialization,
            
            // Fix sa Address (Barangay Mapping)
            currentAddress: {
                region: currentAddress.region,
                province: currentAddress.province,
                city: currentAddress.city,
                brgy: currentAddress.barangay, 
                street: currentAddress.street,
                houseNumber: currentAddress.houseNumber
            },
            permanentAddress: {
                region: permanentAddress.region,
                province: permanentAddress.province,
                city: permanentAddress.city,
                brgy: permanentAddress.barangay,
                street: permanentAddress.street,
                houseNumber: permanentAddress.houseNumber
            },

            profileImage, password: hashedPassword,
            role: 'dentist',
            
            // --- SECURITY SETTINGS ---
            isVerified: false, // HINDI PA ACTIVE
            activationToken,
            activationExpires
        });

        await newDentist.save();

        // 4. Send Email
        // Gamit ang LOCALHOST link (Gagana ito sa laptop mo)
        const activationLink = `http://localhost:3000/activate-account/${activationToken}`;

        const mailOptions = {
            from: 'NgitiFy Admin <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Activate your Dentist Account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Welcome to NgitiFy, Dr. ${lastName}!</h2>
                    <p>Your account has been created successfully.</p>
                    <p>To start using your account, please verify your email by clicking the button below:</p>
                    <a href="${activationLink}" style="background-color: #005466; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Account</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">This link will expire in 24 hours.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Account created! Please check email for activation.' });

    } catch (error) {
        console.error("Error adding dentist:", error);
        res.status(500).json({ message: 'Server error adding dentist.' });
    }
});

// ACTIVATE ACCOUNT
app.post('/api/activate-account', async (req, res) => {
    try {
        const { token } = req.body;

        // Hanapin ang user na may ganitong token AT hindi pa expired ang oras
        const user = await User.findOne({
            activationToken: token,
            // UPDATE: Gawing new Date() para sigurado ang comparison
            activationExpires: { $gt: new Date() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired activation link.' });
        }

        // Activate User
        user.isVerified = true;
        user.activationToken = undefined; // Clear token
        user.activationExpires = undefined; // Clear expiry
        
        await user.save();

        res.status(200).json({ message: 'Account successfully activated!' });

    } catch (error) {
        console.error("Activation error:", error);
        res.status(500).json({ message: "Server error during activation." });
    }
});

// ... (sa ilalim ng app.post('/api/add-dentist' ...)

// GET ALL DENTISTS

// ... (Sa ilalim ng app.get('/api/dentists' ...)

// DELETE DENTIST
// GENERIC DELETE USER (Works for Dentist, Secretary, Patient)
app.delete('/api/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error during deletion." });
    }
});

// ... (sa ilalim ng app.delete...)

// GET SINGLE DENTIST (For Editing)
app.get('/api/dentists', async (req, res) => {
    try {
        const dentists = await User.find({ role: 'dentist' }).select('name licenseNumber email contactNumber isVerified profileImage');
        res.status(200).json(dentists);
    } catch (error) {
        console.error("Error fetching dentists:", error);
        res.status(500).json({ message: "Server error fetching dentists." });
    }
});

// 3. GET SINGLE DENTIST (FOR EDITING/VIEWING)
app.get('/api/dentist/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error fetching dentist:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 2. UPDATE DENTIST (Para sa Save Changes)
// UPDATE DENTIST (No Password Update)
app.put('/api/dentist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Tinanggal ko na ang password sa destructuring
        const { 
            firstName, middleName, lastName, 
            email, phone, birthdate, 
            licenseNumber, specialization, 
            currentAddress, permanentAddress,
            profileImage 
        } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update fields
        // ... sa loob ng /api/dentist/:id (PUT)

        // Update fields
        user.name = { first: firstName, middle: middleName, last: lastName };
        user.email = email;
        user.contactNumber = phone;
        user.birthdate = birthdate;
        user.licenseNumber = licenseNumber;
        user.specialization = specialization;

        // --- CHANGE STARTS HERE ---
        user.currentAddress = {
            region: currentAddress.region,
            province: currentAddress.province,
            city: currentAddress.city,
            brgy: currentAddress.barangay, // FRONTEND 'barangay' -> DB 'brgy'
            street: currentAddress.street,
            houseNumber: currentAddress.houseNumber
        };

        user.permanentAddress = {
            region: permanentAddress.region,
            province: permanentAddress.province,
            city: permanentAddress.city,
            brgy: permanentAddress.barangay, // FRONTEND 'barangay' -> DB 'brgy'
            street: permanentAddress.street,
            houseNumber: permanentAddress.houseNumber
        };
        // --- CHANGE ENDS HERE ---

        if (profileImage) {
            user.profileImage = profileImage;
        }

        // REMOVED: Password update block here. 
        // Password can only be changed via "Forgot Password" or separate "Change Password" settings.

        await user.save();
        res.json({ message: "Dentist updated successfully" });

    } catch (error) {
        console.error("Error updating:", error);
        res.status(500).json({ message: "Server error updating dentist" });
    }
});

// ADD SECRETARY
app.post('/api/add-secretary', async (req, res) => {
    try {
        const { 
            firstName, middleName, lastName, email, phone, birthdate, 
            currentAddress, permanentAddress, password, profileImage 
        } = req.body;

        // Backend Age Validation (18+)
        const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
        if (age < 18) return res.status(400).json({ message: 'Secretary must be at least 18 years old.' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists.' });

        const activationToken = crypto.randomBytes(32).toString('hex');
        const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSecretary = new User({
            name: { first: firstName, middle: middleName, last: lastName },
            email, contactNumber: phone, birthdate, age,
            currentAddress, permanentAddress,
            password: hashedPassword, profileImage,
            role: 'secretary', // ROLE SET TO SECRETARY
            isVerified: false, activationToken, activationExpires
        });

        await newSecretary.save();

        // Send Email (Reuse your mailOptions logic)
        const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
        await transporter.sendMail({
            from: 'NgitiFy Admin <your-email@gmail.com>',
            to: email,
            subject: 'Activate your Secretary Account',
            html: `<h3>Welcome ${firstName}!</h3><p>Click to activate: <a href="${activationLink}">Activate</a></p>`
        });

        res.status(201).json({ message: 'Secretary added successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// ADD PATIENT
app.post('/api/add-patient', async (req, res) => {
    try {
        const { 
            firstName, middleName, lastName, email, phone, birthdate, 
            currentAddress, permanentAddress, password, profileImage,
            guardian, medicalHistory // NEW FIELDS
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists.' });

        // Calculate Age
        const dob = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;

        // Guardian Validation
        if (age < 13 && (!guardian || !guardian.name)) {
            return res.status(400).json({ message: 'Guardian information is required for patients under 13.' });
        }

        const activationToken = crypto.randomBytes(32).toString('hex');
        const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newPatient = new User({
            name: { first: firstName, middle: middleName, last: lastName },
            email, contactNumber: phone, birthdate, age,
            currentAddress, permanentAddress,
            password: hashedPassword, profileImage,
            role: 'patient',
            guardian: age < 13 ? guardian : {}, // Save guardian only if needed
            medicalHistory, // Save medical history checklist
            isVerified: false, activationToken, activationExpires
        });

        await newPatient.save();

        // Send Email
        const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
        await transporter.sendMail({
            from: 'NgitiFy Admin',
            to: email,
            subject: 'Activate Patient Account',
            html: `<h3>Welcome ${firstName}!</h3><p>Click to activate: <a href="${activationLink}">Activate</a></p>`
        });

        res.status(201).json({ message: 'Patient added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
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

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not activated. Please check your email." });
        }

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

// GET USERS BY ROLE
app.get('/api/users', async (req, res) => {
    try {
        const { role } = req.query; // Kukunin ang ?role=secretary o ?role=patient sa URL
        
        let query = {};
        if (role) {
            query.role = role;
        }

        // Kukunin lahat ng user na pasok sa role (ex: lahat ng secretary)
        const users = await User.find(query).select('-password'); // Exclude password for security
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error fetching users." });
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