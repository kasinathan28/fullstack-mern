const mongoose = require("mongoose");

// Define the cancellation schema
const declinedcancellationSchema = new mongoose.Schema({
  // payment intent id
  paymentIntentId: {
    type: String,
  },

});

// Create the 'Cancellation' model
const DeclinedCanellation = mongoose.model("DeclinedCancellation", declinedcancellationSchema);

// Export the Cancellation model
module.exports = DeclinedCanellation;
