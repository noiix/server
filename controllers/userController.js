const { User, Verification } = require("../connections/userDB");
const { sendMail } = require("../models/emailModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const createUser = (req, res) => {
  const newUser = req.body;
  User.findOne({ email: newUser.email }).then((result) => {
    if (result) {
      res.json({ message: "you already have an account" });
    } else {
      User.create(newUser).then((createdUser) => {
        let random = Math.random().toString(36).slice(-8);
        console.log(createdUser);
        Verification.create({
          authId: createdUser._id,
          secretKey: random,
        }).then(() => {
          // sendMail(
          //   createdUser.email,
          //   "verify email",
          //   `Hello, This email address: ${createdUser.email} is used to register in Mock Library. To verify your account please click on <a href="user/verify?authId=${createdUser._id}&secretKey=${random}">this link</a>
          //               Thanks,
          //               Your nöix Team.`
          // );
        });
      });
    }
  });
};

module.exports = { createUser };
