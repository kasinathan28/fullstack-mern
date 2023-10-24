const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String, // You can store the image URL or binary data, depending on your requirements
  },
});

// Create an Admin model from the schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
