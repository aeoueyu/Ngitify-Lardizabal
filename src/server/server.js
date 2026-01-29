const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User.js');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://admin:admin@ngitify.v48xdrk.mongodb.net/?appName=NgitiFy";

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'garciaaeiounicole@gmail.com',
        pass: 'igahrcpmubbnpzpt'
    }
});

mongoose.connect(uri)
    .then(()=>console.log('Connected to MongoDB Atlas!'))
    .catch(err=>console.error('Database connection error:', err));

app.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, contactNumber, address, password } = req.body;
    
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const activationToken = crypto.randomBytes(32).toString('hex');
    
        const newUser = new User({
            fullname,
            email,
            contactNumber,
            address,
            password: hashedPassword,
            activationToken
        });
    
        await newUser.save();
    
        const activationUrl = `http://localhost:5000/api/activate/${activationToken}`;
    
        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Activate Your NgitiFy Account',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #28a745;">Welcome to NgitiFy!</h1>
                    <p>Hi <strong>${fullname}</strong>,</p>
                    <p>Thank you for joining us. To start using your account, please verify your email address by clicking the button below:</p>
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="${activationUrl}" style="background: #28a745; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">VERIFY EMAIL ADDRESS</a>
                    </div>
                    <p style="font-size: 12px; color: #777;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; color: #28a745;">${activationUrl}</p>
                </div>
            `
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email error: ", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    
        res.status(201).json({ message: 'User registered! Please check your email to activate.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

app.get('/api/activate/:token', async (req, res) => {
    try {
        const user = await User.findOne({ activationToken: req.params.token });
        if (!user) return res.status(400).send("Invalid or expired token.");

        user.isVerified = true;
        user.activationToken = undefined;
        await user.save();

        res.send("<h1>Account successfully activated!</h1><p>You can now login to NgitiFy.</p>");
    } catch (error) {
        res.status(500).send("Error activating account.");
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password." });

        if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

        const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = loginOtp;
        await user.save();

        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Your Login OTP',
            html: `<h1>Your Login OTP is: <strong>${loginOtp}</strong></h1><p>Do not share this with anyone.</p>`
        };

        transporter.sendMail(mailOptions);
        
        res.status(200).json({ message: "OTP sent to email", email: email });

    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
});

app.post('/api/verify-login-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otpCode: otp });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP." });

        user.otpCode = undefined;
        await user.save();

        res.status(200).json({ message: "Login successful!", fullname: user.fullname });
    } catch (error) {
        res.status(500).json({ message: "Verification error." });
    }
});

app.post('/api/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found." });

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = newOtp;
        await user.save();

        const mailOptions = {
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Your New Login OTP',
            html: `<h1>Your NEW Login OTP is: <strong>${newOtp}</strong></h1><p>This replaces your previous code.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "New OTP sent!" });
    } catch (error) {
        res.status(500).json({ message: "Error resending OTP." });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not found." });

        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        user.otpCode = resetCode;
        await user.save();

        await transporter.sendMail({
            from: '"NgitiFy Team" <garciaaeiounicole@gmail.com>',
            to: email,
            subject: 'Password Reset Code',
            html: `<h1>Your reset code is: <strong>${resetCode}</strong></h1>`
        });
        res.status(200).json({ message: "Code sent!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email." });
    }
});

app.post('/api/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email, otpCode: code });
    if (!user) return res.status(400).json({ message: "Invalid code." });
    res.status(200).json({ message: "Code verified." });
});

app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await User.findOneAndUpdate({ email }, { 
            password: hashedPassword, 
            otpCode: undefined
        });
        res.status(200).json({ message: "Password updated!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password." });
    }
});

app.listen(5000, ()=>console.log('Server running on http://localhost:5000'));