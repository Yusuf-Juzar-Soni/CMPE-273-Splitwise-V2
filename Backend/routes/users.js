const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const Bill = require("../models/Bill");
var kafka = require("../kafka/client");

app.use(express.json());

// Load Input Validation
// const validateRegisterInput = require("../../validation/register");
// const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  //   const { errors, isValid } = validateRegisterInput(req.body);

  //   // Check Validation
  //   if (!isValid) {
  //     return res.status(400).json(errors);
  //   }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      console.log(newUser, "new user");

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  //   const { errors, isValid } = validateLoginInput(req.body);

  //   // Check Validation
  //   if (!isValid) {
  //     return res.status(400).json(errors);
  //   }

  const email = req.body.email;
  const password = req.body.password;

  console.log(email);
  console.log(password),
    // Find user by email
    User.findOne({ email }).then((user) => {
      // Check for user
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User Matched
          const payload = { id: user.id, name: user.name, email: user.email }; // Create JWT Payload

          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 35000 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                email: user.email,
                name: user.name,
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

// router.post(
//   "/getActivity",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     const user_email = req.body.email;
//     let final_result = [];
//     let i;
//     console.log(user_email);
//     await User.find(
//       { email: user_email },
//       {
//         groupsPartOf: 1,
//         _id: 0,
//       }
//     ).then(async (groups) => {
//       if (groups) {
//         console.log("array ofgroups is", groups);
//         for (i = 0; i < groups[0].groupsPartOf.length; i++) {
//           let list_of_bills = await Bill.find(
//             { created_in: groups[0].groupsPartOf[i] },
//             {
//               created_by: 1,
//               created_in: 1,
//               bill_desc: 1,
//               created_time: 1,
//               bill_amount: 1,
//               _id: 0,
//             }
//           );
//           final_result = list_of_bills;
//         }
//         res.status(200).json(final_result);
//       } else {
//         res
//           .status(400)
//           .json({ message: "Error has occured, bills could not be displayed" });
//       }
//     });
//   }
// );

router.post(
  "/getActivity",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user_email = req.body.email;
    let final_result = [];
    let i;
    const page = parseInt(req.body.page);
    const limit = parseInt(req.body.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const len = await Bill.countDocuments().exec();

    console.log("length of Bills", len);

    const results = {};

    if (endIndex < (await Bill.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    console.log(user_email);
    await User.find(
      { email: user_email },
      {
        groupsPartOf: 1,
        _id: 0,
      }
    ).then(async (groups) => {
      if (groups) {
        console.log("array ofgroups is", groups);
        for (i = 0; i < groups[0].groupsPartOf.length; i++) {
          let list_of_bills = await Bill.find(
            { created_in: groups[0].groupsPartOf[i] },
            {
              created_by: 1,
              created_in: 1,
              bill_desc: 1,
              created_time: 1,
              bill_amount: 1,
              _id: 0,
            }
          );

          console.log("This is list of bills", list_of_bills);
          final_result = final_result.concat(list_of_bills);
        }
        result = final_result.slice(startIndex, endIndex);

        res.status(200).json(result);
      } else {
        res
          .status(400)
          .json({ message: "Error has occured, bills could not be displayed" });
      }
    });
  }
);

router.post(
  "/getGroups",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    kafka.make_request("getGroups", req.body, function (err, results) {
      console.log("in result");
      console.log("results in my getgroups ", results);
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "Could not fetch groups, Try Again.",
        });
      } else {
        res.send(JSON.stringify(results));
      }
    });
  }
);

router.post(
  "/getProfile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.body.email;
    console.log(user);
    await User.find(
      { email: user },
      {
        name: 1,
        email: 1,
        phonenumber: 1,
        currency: 1,
        timezone: 1,
        language: 1,
        photostring: 1,
        _id: 0,
      }
    ).then((groups) => {
      if (groups) {
        console.log("This is profile of  user ", groups);
        res.status(200).json(groups);
      } else {
        res.status(400).json({
          message: "Error has occured, profile could not be displayed",
        });
      }
    });
  }
);

router.post(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const phonenumber = req.body.phonenumber;
    const currency = req.body.currency;
    const time = req.body.timezone;

    await User.updateOne(
      { email: email },
      {
        $set: {
          name: name,
          phonenumber: phonenumber,
          currency: currency,
          timezone: time,
        },
      }
    ).then((groups) => {
      if (groups) {
        console.log("This is profile of  user ", groups);
        res.status(200).json(groups);
      } else {
        res.status(400).json({
          message: "Error has occured, profile could not be displayed",
        });
      }
    });
  }
);

router.post(
  "/getAllUsers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const email = req.body.email;
    console.log(email);
    User.find({ email: { $nin: email } }, { name: 1, email: 1, _id: 0 }).then(
      (users) => {
        if (users) {
          console.log("This is members", users);
          res.status(200).json(users);
        } else {
          res.status(400).json({
            message: "Error has occured, users could not be displayed",
          });
        }
      }
    );
  }
);

module.exports = router;
