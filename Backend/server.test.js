const assert = require("chai").assert;
const index = require("./server");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

describe("Splitwise", function () {
  describe("Login Test", function () {
    it("Incorrect Password", () => {
      agent
        .post("/login")
        .send({ email: "abc@hotmail.com", password: "test1234" })
        .then(function (res) {
          expect(res.text).to.equal('{"message":"Invalid credentials!"}');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Signup", function () {
    it("Signup", () => {
      agent
        .post("/signup")
        .send({
          name: "Logan Griffo",
          email: "logan@gmailmail.com",
          password: "test1234",
        })

        .then(function (res) {
          expect(res.text).to.equal('{"message":"User already exists!"}');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Display groups", function () {
    it("Groups", () => {
      agent
        .post("/dashboard")
        .send({ email: "logan@gmail.com" })
        .then(function (res) {
          expect(res.text).to.equal(
            '["FAREWELL PARTY","GROCERY","Hogwarts","RENT","TRIP"]'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Get invites", function () {
    it("Get Invites", () => {
      agent
        .get("/getInvites/:email")
        .send({ useremail: "abc@hotmail.com" })
        .then(function (res) {
          expect(res.text).to.equal('{"group_list":[]}');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  describe("Get Activity ", function () {
    it("Name for Dashboard", () => {
      agent
        .get("/Activity/:email")

        .then(function (res) {
          expect(res.text).to.equal("[]");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
});
