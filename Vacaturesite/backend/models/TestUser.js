// backend/models/TestUser.js
const mongoose = require('mongoose');

const TestUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestUser', TestUserSchema);
