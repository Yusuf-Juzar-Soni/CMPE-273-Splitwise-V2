const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const Group = require("../models/Group");
const Bill = require("../models/Bill");
const Transaction = require("../models/Transaction");
const Comment = require("../models/Comment");
//passport config
require("../config/passport")(passport);
app.use(express.json());
app.use(passport.initialize());

router.post(
  "/createComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user_email, c_body, bill } = req.body;
    const newComment = new Comment({
      comment_body: c_body,
      commented_by: user_email,
      bill_id: bill,
    });
    console.log("Bill heree", bill);
    await newComment.save().then(async (comment) => {
      if (comment) {
        res.status(200).json({ message: "comment added successfully" });
      } else {
        res.status(400).json({ message: "failed to add comment" });
      }
    });
  }
);

router.post(
  "/deleteComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const c_id = req.body.comment_id;
    console.log("Comment to be deleted", c_id);
    await Comment.deleteOne({ _id: c_id }).then((comments) => {
      if (comments) {
        res.status(200).json({ message: "Comment deleted successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Error has occured, comment could not be deleted" });
      }
    });
  }
);

router.post(
  "/getComments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const billId = req.body.bill_id;

    await Comment.find(
      { bill_id: billId },
      { comment_body: 1, commented_by: 1, _id: 1 }
    ).then((comments) => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(400).json({
          message: "Error has occured, comments could not be retrived",
        });
      }
    });
  }
);
module.exports = router;
