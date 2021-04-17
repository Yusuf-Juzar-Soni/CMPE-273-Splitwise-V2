const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
const session = require("express-session");
app.use(express.static(__dirname + "/public"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const users = require("./routes/users");
const groups = require("./routes/groups");
const invites = require("./routes/invites");
const bills = require("./routes/bills");
const comments = require("./routes/comments");
const transactions = require("./routes/transactions");

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use(users);
app.use(groups);
app.use(invites);
app.use(bills);
app.use(comments);
app.use(transactions);

app.use(
  session({
    secret: "compe273_lab1_splitwise",
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
);

app.listen(PORT, () => {
  console.log("Server connected to port 3001");
});

module.exports = app;
