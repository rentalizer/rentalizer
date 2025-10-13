#!/usr/bin/env node

/**
 * Create or update a superadmin user.
 *
 * Usage:
 *   node scripts/createSuperUser.js <email> <password> [firstName] [lastName]
 *
 * Example:
 *   node scripts/createSuperUser.js team@rentalizer.com "MySecurePass123" "Rentalizer" "Team"
 */

const path = require('path');
const mongoose = require('mongoose');
const { ensureSuperAdminUser } = require('../services/adminProvisionService');

// Ensure .env is loaded (fallback to server/.env)
require('dotenv').config({
  path: process.env.SERVER_ENV_PATH || path.resolve(__dirname, '../.env')
});

const [email, password, firstNameArg, lastNameArg] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: node scripts/createSuperUser.js <email> <password> [firstName] [lastName]');
  process.exit(1);
}

const firstName = firstNameArg || 'Rentalizer';
const lastName = lastNameArg || 'Team';

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not set. Please configure it in server/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000
  });
};

const createSuperUser = async () => {
  process.env.ADMIN_EMAIL = email;
  process.env.ADMIN_PASSWORD = password;
  process.env.ADMIN_FIRST_NAME = firstName;
  process.env.ADMIN_LAST_NAME = lastName;

  await connectToDatabase();

  try {
    await ensureSuperAdminUser();
    console.log('➡️  You can now sign in using the provided credentials.');
  } catch (error) {
    console.error('❌ Failed to create superadmin user:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createSuperUser();
