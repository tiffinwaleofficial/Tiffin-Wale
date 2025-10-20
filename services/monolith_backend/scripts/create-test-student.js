#!/usr/bin/env node

/**
 * Script to create a test student user directly in the database
 * 
 * Usage: node scripts/create-test-student.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tiffinmate';
const SALT_ROUNDS = 10;

// User schema to match the one in the application
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['user', 'admin', 'super_admin', 'business_partner'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create a User model
const User = mongoose.model('User', userSchema);

// Function to create test student users
const createTestStudents = async () => {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const testUsers = [
      {
        email: 'rahul@gmail.com',
        password: 'Student123!',
        name: 'Rahul Kumar',
        phone: '+91-9876543210',
        role: 'user'
      },
      {
        email: 'student@test.com',
        password: 'Student123!',
        name: 'Test Student',
        phone: '+91-9876543211',
        role: 'user'
      }
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`Test student user already exists with email: ${userData.email}`);
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

      // Create a new student user
      const studentUser = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        role: userData.role,
        isActive: true
      });

      // Save to database
      await studentUser.save();
      console.log(`Successfully created test student user:`);
      console.log(`- Email: ${userData.email}`);
      console.log(`- Password: ${userData.password}`);
      console.log(`- Name: ${userData.name}`);
    }

  } catch (error) {
    console.error('Error creating test student users:', error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    console.log('Script completed successfully');
  }
};

// Run the script
createTestStudents();
