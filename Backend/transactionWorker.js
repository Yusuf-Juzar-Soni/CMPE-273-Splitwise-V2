const mysql = require("mysql");
const con = mysql.createConnection({
  host: "splitwisedb.ca0vnrrcatej.us-east-2.rds.amazonaws.com", // ip address of server running mysql
  user: "admin", //user name to your my sql server
  password: "test1234",
  database: "splitwise_db",
});

let amountOwedToMe = (user) => {
  console.log("===================");
  console.log(user);

  console.log("===================");
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT  SUM(transaction_amount) as AmountOwed,receiver FROM transaction_table WHERE sender=? AND transaction_amount!= 0 GROUP BY receiver",
      [user],
      (err, result) => {
        if (err == null || err == undefined) {
          console.log("Success Amount Owed Fetched");
          console.log(result);
          resolve(result);
          // console.log(result.insertId);
        } else {
          console.log("failure(Bill Not Added)");
          console.log(err);
          resolve(err);
        }
      }
    );
  });
};

let amountIOwe = (user) => {
  console.log("===================");
  console.log(user);

  console.log("===================");
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT  SUM(transaction_amount) as AmountIOwe,sender FROM transaction_table WHERE receiver=? AND transaction_amount!= 0 GROUP BY sender",
      [user],
      (err, result) => {
        if (err == null || err == undefined) {
          console.log("Success Amount  I Owe Fetched");
          console.log(result);
          resolve(result);
          // console.log(result.insertId);
        } else {
          console.log("failure(Bill Not Added)");
          console.log(err);
          resolve(error);
        }
      }
    );
  });
};


module.exports = {
  amountOwedToMe,
  amountIOwe,
};
