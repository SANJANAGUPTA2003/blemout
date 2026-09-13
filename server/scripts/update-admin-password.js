/**
 * Updates the existing admin password only. Does not create or delete admins.
 * Does not change email. Hashing uses Admin pre('save') (bcrypt cost 12).
 *
 * Requires NEW_ADMIN_PASSWORD in the process environment (set in the shell;
 * do not put a real value in .env). Optional ADMIN_EMAIL if more than one
 * admin document exists.
 *
 * From server/:
 *   $env:NEW_ADMIN_PASSWORD = '<your-new-password>'
 *   node scripts/update-admin-password.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const MIN_PASSWORD_LENGTH = 8;

async function findExistingAdmin() {
  const preferredEmail = (process.env.ADMIN_EMAIL || '').trim();
  const count = await Admin.countDocuments();

  if (count === 0) {
    throw new Error('No admin document found. This script does not create an admin.');
  }

  if (preferredEmail) {
    const admin = await Admin.findOne({ email: preferredEmail });
    if (!admin) {
      throw new Error('No admin found for ADMIN_EMAIL. This script does not create an admin.');
    }
    return admin;
  }

  if (count > 1) {
    throw new Error('Multiple admin documents found. Set ADMIN_EMAIL to choose one.');
  }

  return Admin.findOne();
}

async function main() {
  const newPassword = process.env.NEW_ADMIN_PASSWORD;
  if (newPassword == null || String(newPassword).trim() === '') {
    console.error('NEW_ADMIN_PASSWORD is required. Set it in the environment and retry.');
    process.exit(1);
  }
  if (String(newPassword).length < MIN_PASSWORD_LENGTH) {
    console.error(`NEW_ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGODB_URI (or MONGO_URI) is not defined.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  try {
    const admin = await findExistingAdmin();
    admin.password = newPassword;
    await admin.save();
    console.log(`Admin password updated (${admin.email})`);
  } finally {
    await mongoose.disconnect();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
