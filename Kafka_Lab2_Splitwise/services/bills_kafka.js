var Billmodel = require("../models/Bill");
var Transactionmodel = require("../models/Transaction");
var mongoose = require("./mongoose");

async function handle_request(msg, callback) {
  console.log("In handle request: for get groups" + JSON.stringify(msg));
  const { user_email, group_name, bill_amt, desc, members } = msg;
  console.log("This is members", members);
  const split = bill_amt / members.length;

  let i;
  const newBill = new Billmodel({
    bill_desc: desc,
    created_by: user_email,
    bill_amount: bill_amt,
    created_in: group_name,
  });
  await newBill.save().then(async (bill) => {
    for (i = 0; i < members.length; i++) {
      let NewTransaction = new Transactionmodel({
        transaction_amount: split,
        sender: user_email,
        transaction_in: group_name,
      });
      NewTransaction.receiver = members[i];

      let transaction = await NewTransaction.save();
      if (transaction) {
        console.log(transaction);
      }
    }

    callback(null, { message: "Bill and Transaction Added" });
  });
}

exports.handle_request = handle_request;
