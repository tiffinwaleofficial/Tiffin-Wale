#!/usr/bin/env node

/**
 * Script to create a test admin user directly in the database
 * 
 * Usage: node scripts/create-test-admin.js
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

// Function to create a test admin user
const createTestAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test admin already exists
    const existingUser = await User.findOne({ email: 'admin@test.com' });
    if (existingUser) {
      console.log('Test admin user already exists with email: admin@test.com');
      return existingUser;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin123!', SALT_ROUNDS);

    // Create a new admin user
    const adminUser = new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin',
      isActive: true
    });

    // Save the user
    await adminUser.save();
    console.log('Successfully created test admin user:');
    console.log(`- Email: admin@test.com`);
    console.log(`- Password: Admin123!`);
    
    return adminUser;
  } catch (error) {
    console.error('Error creating test admin user:', error.message);
    throw error;
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

// Execute the function
createTestAdmin()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 