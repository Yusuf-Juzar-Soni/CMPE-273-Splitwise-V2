const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const PORT = 3001;
const session = require("express-session");
const groupWorkerFunc = require("./groupWorkers");
const billWorkerFunc = require("./billWorker");
const transactWorkerFunc = require("./transactionWorker");
const multer = require("multer");
const fs = require("fs");
const util = require("util");
const upload = multer();
const pipeline = util.promisify(require("stream").pipeline);
app.use(express.static(__dirname + "/public"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const bcrypt = require("bcryptjs");

app.use(
  session({
    secret: "compe273_lab1_splitwise",
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const con = mysql.createPool({
  connectionLimit: 10,
  host: "splitwisedb.ca0vnrrcatej.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "test1234",
  ssl: true,
  database: "splitwise_db",
});

// const con = mysql.createConnection({
//   host: "splitwisedb.ca0vnrrcatej.us-east-2.rds.amazonaws.com", // ip address of server running mysql
//   user: "admin", //user name to your my sql server
//   password: "test1234",
//   database: "splitwise_db",
// });

// con.connect((err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log("Connected!");
// });

//Allow Access Control

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", function (req, res) {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const encryptedpassword = bcrypt.hashSync(password, salt);

  con.query(
    "INSERT INTO users (username, user_email, password) VALUES (?,?,?)",
    [name, email, encryptedpassword],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log("User already present!!");
          res.status(409).json({ message: "User already exists!" });
        }
      } else {
        const user = { username: req.body.email, password: req.body.password };
        req.session.user = user;
        res.status(200).json({ name: req.body.name, email: req.body.email });
      }
    }
  );
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  console.log(req.body.password);

  con.query(
    "SELECT * FROM  users WHERE user_email=?",
    [email],
    (err, result) => {
      if (result) {
        if (result.length) {
          bcrypt.compare(
            req.body.password,
            result[0].password,
            (err, results) => {
              console.log(result[0].password);
              console.log(results);
              if (results) {
                user = {
                  username: req.body.email,
                  password: req.body.password,
                };
                req.session.user = user;
                console.log(results);
                res.status(200).json({ result });
                res.end("Successful Login");
              } else {
                res.status(404).json({ message: "Invalid Password!" });
              }
            }
          );
        } else if (result.length === 0) {
          res.status(404).json({ message: "Invalid credentials!" });
        }
      }
    }
  );
});

app.post("/dashboard", (req, res) => {
  let { email } = req.body;
  con.query(
    "SELECT group_name FROM user_group WHERE user_email=? AND invite_status= 1",
    [email],
    function (err, result) {
      let groups = [];
      for (let i = 0; i < result.length; i++) {
        groups.push(result[i].group_name);
      }

      res.status(200).json(groups);
    }
  );
});

app.get("/allUsers/:email", (req, res) => {
  con.query(
    "select user_email, username from users where user_email != ?",
    [req.params.email],
    (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.post("/allMembers", (req, res) => {
  console.log(req.body.email);
  console.log(req.body.groupname);
  con.query(
    "select user_email from user_group where group_name = ? and invite_status= 1",
    [req.body.groupname],
    (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.post("/addBill", function (req, res) {
  console.log(req.body);
  const user = req.body.user;
  const billdesc = req.body.billData;
  const amount = req.body.amount;
  const group = req.body.group;
  const members = req.body.members;
  const split_amount = amount / members.length;
  console.log(user);
  console.log(billdesc);
  console.log(amount);
  console.log(group);
  console.log(members);
  console.log(split_amount);

  billWorkerFunc.BillAdd(amount, billdesc, user, split_amount, group);

  // con.query(
  //   "INSERT INTO bill_table (bill_amount, bill_desc, created_by,split_amount,bill_group) VALUES (?,?,?,?,?)",
  //   [amount,billdesc,user,split_amount,group],
  //   (err, result) => {
  //     if (err) {
  //       if (err.code === "ER_DUP_ENTRY") {
  //         console.log("Bill addition failed");
  //       }
  //     } else {
  //       console.log("Bill Added Successfully" );

  //     }

  //   }
  // );

  for (member of members) {
    con.query(
      "INSERT INTO transaction_table (sender, receiver, transaction_amount,bill_group) VALUES (?,?,?,?)",
      [user, member.user_email, split_amount, group],
      (err, result) => {
        if (err) {
          if (err) {
            console.log(err);
          }
        } else {
          console.log("Bill Added Successfully in transaction table");
        }
      }
    );
  }
  res.status(200).json({ message: " successfully added in both" });
});

app.post("/createGroup", (req, res) => {
  console.log(req.body.members);
  console.log(req.body.groupName);

  groupWorkerFunc
    .createGroup(req.body.groupName, req.body.members, req.body.user)
    .then((result) => {
      if (result == true) {
        res.status(200).json({ messgae: "successful" });
      } else {
        if (result.code === "ER_DUP_ENTRY") {
          res.status(409).json({ message: "failure" });
        } else {
          res.status(400).json({ message: "failure" });
        }
      }
    });
});

app.get("/fetchBills/:group", (req, res) => {
  con.query(
    "select created_by, bill_amount, bill_timestamp from bill_table where bill_group = ?",
    [req.params.group],
    (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.get("/Activity/:email", (req, res) => {
  con.query(
    "SELECT * from bill_table where bill_group IN(select group_name from user_group where user_email = ?)",
    [req.params.email],
    (err, result) => {
      if (!err) {
        console.log(result);
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.post("/userdetails", (req, res) => {
  con.query(
    "SELECT * from users where user_email = ?",
    [req.body.email],
    (err, result) => {
      console.log(result);
      if (!err) {
        console.log(result);
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

// app.get("/fetchAmountsOwed/:email", (req, res) => {
//   transactWorkerFunc.amountOwedToMe(req.params.email).then((result) => {
//     if (result) {
//       console.log("Success fetched owed amount");
//       res.status(200).send(result);
//     }
//   });
// });

// app.get("/fetchAmountsIOwe/:email", (req, res) => {
//   transactWorkerFunc.amountIOwe(req.params.email).then((result) => {
//     if (result) {
//       console.log("Success fetched owed amount");
//       res.status(200).send(result);
//     }
//   });
// });

async function fetchResultIOwe(user) {
  let result = [];
  let groups = await groupWorkerFunc.getGroups(user);
  console.log(groups);
  let stringGroups = "";
  if (!groups) {
    return;
  }
  for (let group of groups) {
    stringGroups = stringGroups + "'" + group.group_name + "',";
  }
  stringGroups = stringGroups.substring(0, stringGroups.length - 1);
  let members = await groupWorkerFunc.getMembersAcrossGroups(stringGroups);

  if (!members) {
    members = [];
  }

  for (let email of members) {
    let sent = await groupWorkerFunc.getAmount(user, email.user_email);
    let recieved = await groupWorkerFunc.getAmount(email.user_email, user);
    let diff = sent[0].Sum - recieved[0].Sum;
    result.push({ email: email.user_email, amt: diff });
  }
  console.log(result);
  return result;
}

app.get("/amount/:user", (req, res) => {
  console.log(req.params.user);

  fetchResultIOwe(req.params.user)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      //need to add error handling
      console.log(err);
    });
});

app.post("/settleUpOwe", (req, res) => {
  console.log("user", req.body.user);
  console.log("sender", req.body.sender);
  console.log("amount", req.body.amt);

  con.query(
    "INSERT INTO transaction_table (sender, receiver, transaction_amount,bill_group) VALUES (?,?,?,?)",
    [req.body.user, req.body.sender, req.body.amt, "Group 0"],
    (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.post("/settleUpOwed", (req, res) => {
  console.log("user", req.body.user);
  console.log("sender", req.body.sender);
  console.log("amount owed:", req.body.amount);

  con.query(
    "INSERT INTO transaction_table (sender, receiver, transaction_amount,bill_group) VALUES (?,?,?,?)",
    [req.body.sender, req.body.user, req.body.amount, "Group 0"],
    (err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.get("/getInvites/:email", (req, res) => {
  con.query(
    "SELECT group_name FROM user_group WHERE user_email=? AND invite_status = 0;",
    [req.params.email],
    (err, result) => {
      if (result) {
        console.log(result);
        const group_list = [];
        for (let i = 0; i < result.length; i++) {
          console.log("Inside if1");
          group_list.push(result[i].group_name);
        }
        res.status(200).json({ group_list: group_list });
      } else {
        res.status(400).json({ message: "failed" });
      }
    }
  );
});

app.post("/acceptInvite", (req, res) => {
  console.log(req.body.selectedgroup);
  console.log(req.body.user);

  con.query(
    "UPDATE user_group SET invite_status = 1 where group_name= ? and user_email = ?",
    [req.body.selectedgroup, req.body.user],
    (err, result) => {
      if (!err) {
        res.status(200).json({ message: "successful" });
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.post("/leaveGroup", (req, res) => {
  console.log("inside Leave group", req.body.user);
  console.log(req.body.group);

  console.log("inside leave group ");
  con.query(
    "UPDATE user_group SET invite_status = 2 where group_name= ? and user_email = ?",
    [req.body.group, req.body.user],
    (err, result) => {
      if (!err) {
        res.status(200).json({ message: "successful" });
      } else {
        res.status(400).json({ error: "an error occured" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Server connected to port 3001");
});

module.exports = app;
