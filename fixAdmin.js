const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Siguraduhin tama path sa User.js

// Ito yung connection string galing sa server.js mo
const MONGO_URI = 'mongodb+srv://ngitify:123@cluster0.on1ll.mongodb.net/ngitify?retryWrites=true&w=majority&appName=Cluster0';

const fixAdmin = async () => {
    try {
        // FIX: Tinanggal na ang deprecated options
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'admin@gmail.com';
        const password = 'AdminUser_123';
        const role = 'owner'; // Ito ang mahalaga: lowercase 'owner'

        // I-hash ang password gamit ang bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Hanapin kung may existing admin
        let user = await User.findOne({ email });

        if (user) {
            // Kung meron, i-update lang natin para mag-match sa bagong system
            console.log('Existing Admin found. Updating credentials...');
            user.password = hashedPassword;
            user.role = role; 
            user.isVerified = true;
            
            // Siguraduhing may pangalan para di mag error
            if(!user.name || !user.name.first) user.name = { first: 'Admin', last: 'User' };

            await user.save();
            console.log('✅ Admin account updated successfully!');
        } else {
            // Kung wala, gumawa ng bago
            console.log('Admin not found. Creating new temporary admin...');
            const newUser = new User({
                name: { first: 'Admin', last: 'User' },
                email,
                password: hashedPassword,
                role,
                isVerified: true,
                contactNumber: '09123456789'
            });
            await newUser.save();
            console.log('✅ Temporary Admin created successfully!');
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixAdmin();