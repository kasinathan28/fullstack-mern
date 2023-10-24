const mongoose = require("mongoose");

// Define the cancellation schema
const cancellationSchema = new mongoose.Schema({
  // payment intent id
  paymentIntentId: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  // User details
  userName: {
    type: String,
    required: true,
  }

  // Add more fields as needed for your booking data
});

// Create the 'Cancellation' model
const Cancellation = mongoose.model("Cancellation", cancellationSchema);

// Export the Cancellation model
module.exports = Cancellation;
