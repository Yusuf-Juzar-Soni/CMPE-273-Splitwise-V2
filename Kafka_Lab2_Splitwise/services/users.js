var Usermodel = require("../models/User");
var mongoose = require("./mongoose");

async function handle_request(msg, callback) {
  console.log("In handle request: for get groups" + JSON.stringify(msg));
  const user = msg.email;
  console.log(user);
  await Usermodel.find(
    { email: user },
    {
      groupsPartOf: 1,
      _id: 0,
    }
  ).then((groups) => {
    if (groups) {
      console.log("This is groups user is part of", groups);
      callback(null, groups);
    } else {
      callback(null, {
        message: "Error has occured, groups could not be displayed",
      });
    }
  });
}

exports.handle_request = handle_request;
