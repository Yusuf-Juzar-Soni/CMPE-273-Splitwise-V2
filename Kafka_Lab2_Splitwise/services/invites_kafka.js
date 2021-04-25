var mongoose = require("./mongoose");
var Usermodel = require("../models/User");

async function handle_request(msg, callback) {
  const user_email = msg.email;
  console.log(user_email);
  await Usermodel.find(
    { email: user_email },
    { groupsInvitedTo: 1, _id: 0 }
  ).then((inv_groups) => {
    if (inv_groups) {
      console.log("This is list of invites", inv_groups);
      //res.status(200).json(inv_groups);
      callback(null, inv_groups);
    } else {
      // res.status(400).json({
      //   message: "Error has occured, could not fetch list of invites",
      // });
      callback(null, { message: "failed to fetch list of members" });
    }
  });
}

exports.handle_request = handle_request;
