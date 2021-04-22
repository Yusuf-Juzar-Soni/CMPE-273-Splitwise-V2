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
    type: String,
    required: false,
    default: "000-000-0000",
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
    type: String,
    default: "(GMT-08:00) Pacific Time (US & Canada)",
  },
  language: {
    type: String,
    default: "English",
    max: 50,
  },
  photostring: {
    type: String,
    default:
      "https://splitwiseyusuf123.s3.us-east-2.amazonaws.com/d1b98d2059dc419d2c012cc1cee52154.jpg",
  },
  groupsPartOf: [{ type: String, ref: "Groups" }],

  groupsInvitedTo: [{ type: String, ref: "Groups" }],
});

module.exports = User = mongoose.model("users", UserSchema);
