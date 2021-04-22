const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema({
  group_name: {
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
  group_photostring: {
    type: String,
    default: "default.jpg",
  },
  bills: {
    type: Array,
    default: [],
  },
  members: [{ type: String, ref: "User" }],
  invitedMembers: [{ type: String, ref: "User" }],
});

module.exports = mongoose.model("Group", groupSchema);
