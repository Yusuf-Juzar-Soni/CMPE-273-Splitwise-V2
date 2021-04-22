var mongoose = require("./mongoose");
var Commentmodel = require("../models/Comment");

async function handle_request(msg, callback) {
  console.log("In handle request: for get groups" + JSON.stringify(msg));
  const { user_email, c_body, bill } = msg;
  const newComment = new Commentmodel({
    comment_body: c_body,
    commented_by: user_email,
    bill_id: bill,
  });
  console.log("Bill heree", bill);
  await newComment.save().then(async (comment) => {
    if (comment) {
      callback(null, { message: "comment added successfully" });
    } else {
      callback(null, { message: "failed to add comment" });
    }
  });
}

exports.handle_request = handle_request;
