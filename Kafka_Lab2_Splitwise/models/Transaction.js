const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    max: 300,
  },
  receiver: {
    type: String,
    required: true,
    max: 300,
  },

  transaction_in: {
    type: String,
  },

  transaction_amount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
