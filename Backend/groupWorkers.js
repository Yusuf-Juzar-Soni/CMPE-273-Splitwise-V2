const mysql = require("mysql");
const con = mysql.createConnection({
  host: "splitwisedb.ca0vnrrcatej.us-east-2.rds.amazonaws.com", // ip address of server running mysql
  user: "admin", //user name to your my sql server
  password: "test1234",
  database: "splitwise_db",
});

let createUserGroup = (member, groupName, status) => {
  return new Promise((resolve, reject) => {
    con.query(
      "insert into user_group (user_email, group_name,invite_status) values (?, ?, ?)",
      [member, groupName, status],
      (err, result) => {
        if (err == null || err == undefined) {
          console.log("success");
          resolve(true);
        } else {
          console.log("failure");
          console.log(err);
          resolve(false);
        }
      }
    );
  });
};

let createGroups = (groupName) => {
  return new Promise((resolve, reject) => {
    con.query(
      "INSERT INTO splitwise_db.groups (group_name) VALUES ( ? )",
      [groupName],
      (err, result) => {
        if (err == null || err == undefined) {
          console.log("success(group table insert)");
          resolve(true);
        } else {
          console.log("failure(group table not inserted)");
          resolve(err);
        }
      }
    );
  });
};

async function createGroup(groupName, members, user) {
  console.log( "Members dispalyed Here",members);
  let res = await createGroups(groupName);
  console.log(res);

  if (res == true) {
    res = await createUserGroup(user, groupName, 1);
    console.log(res);
    if (res == true) {
      let result = false;
      for (member of members) {
        result = await createUserGroup(member, groupName, 0);
        console.log(result);

        if (result) {
          console.log("operation success (complete operation)");
        
        } else {
          console.log("operation failed (commplete operation)");
          return false;
        }
      }
      return true;
    } else {
      return res;
    }
  } else {
    return res;
  }
}

let getAmount = (user, email) => {
  return new Promise((resolve, reject) => {
    console.log(email);
    con.query(
      "Select SUM(transaction_amount) As Sum from transaction_table where receiver=? and sender=?;",
      [email, user],
      (err, result) => {
        console.log(result);
        resolve(result);
      }
    );
  });
};

let getMembersAcrossGroups = (stringGroups) => {
  return new Promise((resolve, reject) => {
    console.log(stringGroups);

    con.query(
      "SELECT distinct user_email from user_group where invite_status= 1 and group_name in" +
        "  ( " +
        stringGroups +
        " ) ",
      (err, result) => {
        resolve(result);
      }
    );
  });
};

let getGroups = (user) => {
  return new Promise((resolve, reject) => {
    try {
      con.query(
        "SELECT distinct group_name from user_group where user_email=? ",
        [user],
        (err, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  createGroup,
  getAmount,
  getMembersAcrossGroups,
  getGroups,
};
