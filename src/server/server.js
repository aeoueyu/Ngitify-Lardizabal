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
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        if (role && user.role !== role) {
             return res.status(403).json({ message: "Access denied. You cannot log in with this role." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        // Pwede mo na i-uncomment ito kung gusto mo strict na verified muna bago login
        // if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first." });

        const token = jwt.sign({ userId: user._id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
        res.json({ token, role: user.role, userId: user._id });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// --- ACTIVATE ACCOUNT ---
app.post('/api/activate-account', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "No token provided." });
        }

        // Hanapin ang user na may ganitong activation token
        const user = await User.findOne({ activationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired activation link." });
        }

        // Activate user
        user.isVerified = true;
        user.activationToken = undefined; // Alisin na ang token para di na magamit ulit
        await user.save();

        res.json({ message: "Account activated successfully!" });

    } catch (error) {
        console.error("Activation Error:", error);
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
                
                <p style="margin-top: 20px; font-size: 12px; color: #777;">If the button doesn't work, copy this link: <br> ${activationLink}</p>
            </div>
        `
    };
    await transporter.sendMail(mailOptions);
};

// --- ADD DENTIST ---
app.post('/api/add-dentist', async (req, res) => {
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
            role: 'dentist',
            isVerified: false, 
            activationToken,
            ...otherData
        });
        await newUser.save();

        // Send Email
        const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
        await sendActivationEmail(email, 'Dentist', tempPassword, activationLink);
        
        console.log(`✅ Email sent to Dentist: ${email}`);
        res.status(201).json({ message: 'Dentist added successfully. Email sent.' });

    } catch (error) {
        console.error("Error adding dentist:", error);
        res.status(500).json({ message: "Server error or Email failed." });
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
    } catch (error) {
        res.status(500).json({ message: "Server error fetching users." });
    }
});

// --- GENERIC GET SINGLE USER ---
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
// --- GENERIC UPDATE USER (With Email Re-Activation Logic) ---
app.put('/api/user/:id', async (req, res) => {
    try {
        const { password, email, ...updateData } = req.body;
        const userId = req.params.id;

        // 1. Kunin ang current user data
        const currentUser = await User.findById(userId);
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        // 2. Check kung nagbago ang email
        if (email && email !== currentUser.email) {
            console.log(`[UPDATE] Email changed from ${currentUser.email} to ${email}. Re-activating...`);

            // Check kung may gumagamit na ng bagong email
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(409).json({ message: "New email is already in use." });

            // Generate NEW Credentials
            const tempPassword = crypto.randomBytes(4).toString('hex');
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            const activationToken = crypto.randomBytes(32).toString('hex');

            // I-set ang mga updates para sa re-activation
            updateData.email = email;
            updateData.password = hashedPassword;
            updateData.activationToken = activationToken;
            updateData.isVerified = false; // Reset verification status!

            // Update Database
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

            // Send Email sa BAGO
            const activationLink = `http://localhost:3000/activate-account/${activationToken}`;
            await sendActivationEmail(email, currentUser.role, tempPassword, activationLink);

            console.log(`✅ Re-activation email sent to new email: ${email}`);
            return res.json({ message: "User updated. Re-activation email sent to new address.", user: updatedUser });
        }

        // 3. Kung HINDI nagbago ang email, normal update lang
        const updatedUser = await User.findByIdAndUpdate(userId, { ...updateData, email }, { new: true });
        res.json(updatedUser);

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Error updating user." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));