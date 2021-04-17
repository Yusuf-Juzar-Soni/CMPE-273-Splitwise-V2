const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Group = require("../models/Group");
const Bill = require("../models/Bill");
const Transaction = require("../models/Transaction");
require("../config/passport")(passport);
app.use(express.json());
app.use(passport.initialize());

const getAmount = (s_email, r_email) => {
  return new Promise((resolve, reject) => {
    Transaction.aggregate(
      [
        {
          $match: {
            $and: [{ sender: s_email }, { receiver: r_email }],
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$transaction_amount" },
          },
        },
      ],
      function (err, result) {
        console.log("result.total", result[0].total);
        if (result[0].total === "") {
          result[0].total = 0;
          resolve(result);
        } else {
          resolve(result);
        }
      }
    );
  });
};

let getMembersAcrossGroups = (stringGroups) => {
  return new Promise((resolve, reject) => {
    console.log("in members across", stringGroups);
    Group.distinct(
      "members",
      { group_name: { $in: stringGroups } }
      //   { members: 1, _id: 0 }
    ).then((result) => {
      console.log(result);
      resolve(result);
    });
  });
};

let getGroups = (user) => {
  return new Promise((resolve, reject) => {
    try {
      User.distinct("groupsPartOf", { email: user }, function (err, result) {
        // console.log(err, "hello");
        console.log(result, "hello in groups");
        resolve(result);
      });
    } catch (err) {
      console.log(err);
    }
  });
};

async function fetchResultIOwe(user) {
  let result = [];
  let stringGroups = await getGroups(user);
  console.log("in fetch results function", stringGroups);

  if (!stringGroups) {
    return;
  }
  //   for (let group of groups) {
  //     stringGroups = stringGroups + "'" + group.group_name + "',";
  //   }
  //   stringGroups = stringGroups.substring(0, stringGroups.length - 1);
  console.log("After substring", stringGroups);
  let members = await getMembersAcrossGroups(stringGroups);
  console.log("These are members", members);

  if (!members) {
    members = [];
  }

  for (let email of members) {
    console.log("email in loop", email);
    console.log("user in loop", user);
    let sent = await getAmount(user, email);
    console.log("this is sent", sent);
    let recieved = await getAmount(email, user);
    console.log("this is received", recieved);
    
    let diff = sent[0].total - recieved[0].total;
    result.push({ email: email, amt: diff });
  }
  console.log(result);
  return result;
}
router.post(
  "/amount",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user_email = req.body.user;
    console.log(user_email);
    fetchResultIOwe(user_email)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        //need to add error handling
        console.log(err);
      });
  }
);

module.exports = router;
