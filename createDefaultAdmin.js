const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// IMPORTANTE: Ito ang path mula sa ROOT folder papunta sa models
const User = require('./src/models/User'); 

// Connection string (kopyahin mo ito mula sa src/server/server.js kung nagbago man)
const MONGO_URI = 'mongodb+srv://ngitify:123@cluster0.on1ll.mongodb.net/ngitify?retryWrites=true&w=majority&appName=Cluster0';

const createAdmin = async () => {
    try {
        // Connect sa database
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const email = 'admin@gmail.com';
        const rawPassword = 'AdminUser_123';
        const role = 'owner'; // Lowercase 'owner'

        // 1. Hash password
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 2. Check if admin exists
        let user = await User.findOne({ email });

        if (user) {
            console.log('🔄 Updating existing admin account...');
            user.password = hashedPassword;
            user.role = role;
            user.isVerified = true;
            // Siguraduhin na may pangalan para hindi mag-error sa dashboard
            user.name = { first: 'Admin', last: 'User' }; 
            await user.save();
            console.log('🎉 Admin updated successfully!');
        } else {
            console.log('🆕 Creating new admin account...');
            const newAdmin = new User({
                name: { first: 'Admin', last: 'User' },
                email,
                password: hashedPassword,
                role,
                contactNumber: '09123456789',
                isVerified: true
            });
            await newAdmin.save();
            console.log('🎉 Admin created successfully!');
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();