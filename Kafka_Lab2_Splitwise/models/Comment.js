const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment_body: {
    type: String,
    required: true,
    max: 300,
  },
  commented_by: {
    type: String,
  },
  bill_id: {
    type: mongoose.Types.ObjectId,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
