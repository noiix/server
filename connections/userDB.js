const mongoose = require("mongoose");

// user db connection

const userDB = mongoose.createConnection(process.env.DB_LINK_USER, (err) => {
  if (err) throw err;
  console.log("user db is connected");
});
const User = userDB.model("User", require("../models/userModel"));

const Verification = userDB.model(
  "Verification",
  require("../models/verificationModel")
);

module.exports = { userDB, User, Verification };
