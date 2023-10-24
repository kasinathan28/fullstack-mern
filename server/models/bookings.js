const mongoose = require('mongoose');

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  // Product details
  productId:{
    type:String,
    required:true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  // User details
  userName: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type:String,
  },
  // Shipping address
  shippingAddress: {
    type: String,
    required: true,
  },
 
  // Booking date

  // Add more fields as needed for your booking data
});

// Create a Booking model from the schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
