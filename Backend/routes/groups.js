const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Group = require("../models/Group");

//passport config
require("../config/passport")(passport);
app.use(express.json());
app.use(passport.initialize());

router.post(
  "/createGroup",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { groupName, user, members } = req.body;
    User.where("email")
      .in(members)
      .select("email")
      .then((users) => {
        console.log(users);
        User.findOne({ email: user }).then((result) => {
          const newGroup = Group({
            group_name: groupName,
            created_by: result.email,
          });
          newGroup.invitedMembers = members;
          newGroup.members = [user];
          Group.findOne({ group_name: groupName }).then((group) => {
            if (group) {
              res.status(409).json({ message: "Group already exists" });
            } else {
              newGroup.save().then((group) => {
                // res.status(200).json({ message: "group added successfully" });
                console.log(group._id);
                console.log(users);
                // const invite = new User.Invite({ groupId: group._id });
                // console.log(invite);

                User.where("_id")
                  .in(users)
                  .updateMany(
                    { $push: { groupsInvitedTo: group.group_name } },
                    (err, result) => {
                      console.log(user);
                      if (!err) {
                        User.findOneAndUpdate(
                          { email: user },
                          { $push: { groupsPartOf: group.group_name } },
                          (err, result) => {
                            if (!err) {
                              res
                                .status(200)
                                .json({ message: "group added successfully" });
                            } else {
                              res
                                .status(400)
                                .json({ message: "failed to add group" });
                            }
                          }
                        );
                      } else {
                        res
                          .status(400)
                          .json({ message: "failed to add group" });
                      }
                    }
                  );
              });
            }
          });
        });
      });
  }
);

router.post(
  "/getAllMembers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const groupName = req.body.g_name;
    console.log(groupName);
    Group.find({ group_name: groupName }, { members: 1, _id: 0 }).then(
      (members) => {
        if (members) {
          console.log("This is members", members);
          res.status(200).json(members);
        } else {
          res.status(400).json({ message: "Error has occured" });
        }
      }
    );
  }
);

module.exports = router;
