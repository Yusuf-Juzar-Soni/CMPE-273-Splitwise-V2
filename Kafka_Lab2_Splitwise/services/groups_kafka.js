var mongoose = require("./mongoose");
var Groupmodel = require("../models/Group");

async function handle_request(msg, callback) {
  console.log("In handle request: for get groups" + JSON.stringify(msg));
  const groupName = msg.g_name;
  console.log(groupName);
  Groupmodel.find({ group_name: groupName }, { members: 1, _id: 0 }).then(
    (members) => {
      if (members) {
        console.log("This is members", members);

        callback(null, members);
      } else {
        callback(null, { message: "failed to fetch members" });
      }
    }
  );
}

exports.handle_request = handle_request;
