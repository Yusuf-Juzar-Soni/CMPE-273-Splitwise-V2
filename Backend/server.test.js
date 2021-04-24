// const assert = require("chai").assert;
// const index = require("./server");
// const chai = require("chai");
// chai.use(require("chai-http"));
// const expect = require("chai").expect;
// const agent = require("chai").request.agent(index);

// describe("Splitwise", function () {
//   describe("Login Test", function () {
//     it("Incorrect Password", () => {
//       agent
//         .post("/login")
//         .send({ email: "abc@hotmail.com", password: "test1234" })
//         .then(function (res) {
//           expect(res.text).to.equal('{"message":"Invalid credentials!"}');
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });
//   });

//   describe("Signup", function () {
//     it("Signup", () => {
//       agent
//         .post("/signup")
//         .send({
//           name: "Logan Griffo",
//           email: "logan@gmailmail.com",
//           password: "test1234",
//         })

//         .then(function (res) {
//           expect(res.text).to.equal('{"message":"User already exists!"}');
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });
//   });

//   describe("Display groups", function () {
//     it("Groups", () => {
//       agent
//         .post("/getProfile")
//         .send({ email: "logan@gmail.com" })
//         .then(function (res) {
//           expect(res.text).to.equal(
//             '["FAREWELL PARTY","GROCERY","Hogwarts","RENT","TRIP"]'
//           );
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });
//   });

//   describe("Get invites", function () {
//     it("Get Invites", () => {
//       agent
//         .post("/updateProfile")
//         .send({ useremail: "abc@hotmail.com" })
//         .then(function (res) {
//           expect(res.text).to.equal('{"group_list":[]}');
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });
//   });

//   describe("Get Activity ", function () {
//     it("Name for Dashboard", () => {
//       agent
//         .post("/getActivity")

//         .then(function (res) {
//           expect(res.text).to.equal("[]");
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });
//   });
// });

const assert = require("chai").assert;
const index = require("./server");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

var token = "";

let getToken = () => {
  return new Promise((resolve, reject) => {
    agent
      .post("/login")
      .send({ email: "eb@gmail.com", password: "test1234" })
      .then(function (res) {
        token = res.body.token;
        resolve(token);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

describe("Login Test", function () {
  it("Incorrect Password", () => {
    agent
      .post("/login")
      .send({ email: "ow@gmail.com", password: "abc" })
      .then(function (res) {
        expect(res.text).to.equal('{"message":"Invalid credentials!"}');
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it("Successfull login", () => {
    agent
      .post("/login")
      .send({ email: "ow@gmail.com", password: "test1234" })
      .then(function (res) {
        expect(res.body.success).to.equal(true);
        token = res.body.token;
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Sign Up", function () {
  it("Sign user exists", () => {
    agent
      .post("/register")
      .send({
        name: "xxxxxxxxxx",
        email: "xxxxxxxxxx@gmail.com",
        password: "xxxxxxxxxx",
      })
      .then(function (res) {
        expect(res.text).to.equal('{"message":"User already exists!"}');
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Fetch bills", function () {
  it("Get Bills of a Group", async () => {
    let token = await getToken();
    agent
      .post("/getAllBills")
      .send({
        group_name: "GROCERY",
      })
      .set("authorization", token)
      .then(function (res) {
        expect(res.text).to.equal("[]");
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("Profile Test", function () {
  it("User Prfoile", async () => {
    let token = await getToken();
    agent
      .post("/getProfile")
      .send({
        email: "as@gmail.com",
      })
      .set("authorization", token)
      .then(function (res) {

        expect(res.text).to.equal(
          '[{"phonenumber":"777-888-9000","currency":"USD","timezone":"(GMT-08:00) Pacific Time (US & Canada)","language":"English","photostring":"https://splitwiseyusuf123.s3.us-east-2.amazonaws.com/de97147ab124b8f688b10d84a3cb260b.jpg","name":"Amanda Seyfreid","email":"as@gmail.com"}]'
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

  describe("Get Activity ", function () {
    it("Name for Dashboard", () => {
      agent
        .post("/getActivity")
        .send({
          email: "as@gmail.com",
        })
        .set("authorization", token)
        .then(function (res) {
          expect(res.text).to.equal("[]");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
