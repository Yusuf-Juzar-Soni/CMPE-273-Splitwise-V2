const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    max: 300,
  },
  name: {
    type: String,
    required: true,
    min: 6,
    max: 300,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 5000,
  },
  phonenumber: {
    type: Number,
    required: false,
    default: null,
    min: 10,
    max: 10,
  },
  currency: {
    type: String,
    required: false,
    default: "USD",
    min: 3,
    max: 3,
  },
  timezone: {
    type: Date,
    default: Date.now,
  },
  language: {
    type: String,
    default: "English",
    max: 50,
  },
  photostring: {
    type: String,
    default: "default.jpg",
  },
  groupsPartOf: [{ type: String, ref: "Groups" }],

  groupsInvitedTo: [{ type: String, ref: "Groups" }],
});

module.exports = User = mongoose.model("users", UserSchema);
