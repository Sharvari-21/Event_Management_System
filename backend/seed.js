/**
 * One-off script to create the first admin account, since the public
 * signup form intentionally only allows the "user" role.
 *
 * Usage:  npm run seed
 * Reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from .env, falling
 * back to sensible defaults if they're not set.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const User = require("../models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Existing user '${email}' promoted to admin.`);
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`Admin user created: ${email} / ${password}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed script failed:", err.message);
  process.exit(1);
});