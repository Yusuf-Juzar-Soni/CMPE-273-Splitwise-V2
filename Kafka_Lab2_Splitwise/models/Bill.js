const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  bill_desc: {
    type: String,
    required: true,
    max: 300,
  },

  created_by: {
    type: String,
  },

  created_time: {
    type: Date,
    default: Date.now,
  },

  created_in: {
    type: String,
  },

  bill_amount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Bill", billSchema);
