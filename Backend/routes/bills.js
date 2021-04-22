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
var kafka = require("../kafka/client");
//passport config
require("../config/passport")(passport);
app.use(express.json());
app.use(passport.initialize());

// router.post(
//   "/createBill",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     const { user_email, group_name, bill_amt, desc, members } = req.body;
//     console.log("This is members", members);
//     const split = bill_amt / members.length;

//     let i;
//     const newBill = new Bill({
//       bill_desc: desc,
//       created_by: user_email,
//       bill_amount: bill_amt,
//       created_in: group_name,
//     });
//     await newBill.save().then(async (bill) => {

//       for (i = 0; i < members.length; i++) {
//         let NewTransaction = new Transaction({
//           transaction_amount: split,
//           sender: user_email,
//           transaction_in: group_name,
//         });
//         NewTransaction.receiver = members[i];

//         let transaction = await NewTransaction.save();
//         if (transaction) {
//           console.log(transaction);
//         }
//       }
//       res.status(200).json({ message: "Bill and Transaction Added" });
//     });
//   }
// );

router.post(
  "/createBill",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    kafka.make_request("AddBill", req.body, function (err, results) {
      console.log("in result addbill");
      console.log("results in addbill ", results);
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "Could not add bill, Try Again.",
        });
      } else {
        res.status(200).json(results);
      }
    });
  }
);

router.post(
  "/getAllBills",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const groupName = req.body.g_name;
    console.log(groupName);
    await Bill.find(
      { created_in: groupName },
      {
        created_by: 1,
        created_in: 1,
        bill_desc: 1,
        created_time: 1,
        bill_amount: 1,
        _id: 1,
      }
    ).then((bills) => {
      if (bills) {
        console.log("This is bills", bills);
        res.status(200).json(bills);
      } else {
        res
          .status(400)
          .json({ message: "Error has occured, bills could not be displayed" });
      }
    });
  }
);

module.exports = router;
