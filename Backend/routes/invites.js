const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const group = require("../models/Group");
require("../config/passport")(passport);
app.use(express.json());
app.use(passport.initialize());

const updateGroup = (g_name, email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email }).then((user) => {
      console.log("This is user in updateGroup", user);
      group
        .findOneAndUpdate(
          { group_name: g_name },
          { $pull: { invitedMembers: email } }
        )
        .then((result) => {
          console.log(user._id);

          group
            .findOneAndUpdate(
              { group_name: g_name },
              { $push: { members: user.email } }
            )
            .then((result) => {
              if (result) {
                /// need to add better error handling
                resolve(true);
              } else {
                resolve(false);
              }
            });
        });
    });
  });
};
const updateUser = (g_name, email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email }).then((user) => {
      console.log("This is user in updateUser", user);
      User.findOneAndUpdate(
        { email: user.email },
        { $pull: { groupsInvitedTo: g_name } }
      ).then((result) => {
        console.log(user._id);

        User.findOneAndUpdate(
          { email: user.email },
          { $push: { groupsPartOf: g_name } }
        ).then((result) => {
          if (result) {
            /// need to add better error handling
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
  });
};

router.post(
  "/acceptInvite",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const g_name = req.body.groupName;
    const email = req.body.email;
    console.log(g_name);
    console.log(email);
    updateUser(g_name, email).then((result) => {
      if (result) {
        console.log("In result", result);
        updateGroup(g_name, email).then((response) => {
          console.log("in response", response);
          if (response) {
            res.status(200).json({ message: "accepted invite successfully" });
          } else {
            res.status(400).json({ message: "Invite not accepted" });
          }
        });
      }
    });
  }
);

router.post(
  "/getAllInvites",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user_email = req.body.email;
    console.log(user_email);
    await User.find({ email: user_email }, { groupsInvitedTo: 1, _id: 0 }).then(
      (inv_groups) => {
        if (inv_groups) {
          console.log("This is list of invites", inv_groups);
          res.status(200).json(inv_groups);
        } else {
          res.status(400).json({
            message: "Error has occured, could not fetch list of invites",
          });
        }
      }
    );
  }
);

module.exports = router;
