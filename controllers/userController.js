const { User, Verification } = require("../connections/userDB");
const { sendMail } = require("../models/emailModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = (req, res) => {
  const newUser = req.body;
  User.findOne({ email: newUser.email })
    .then((result) => {
      if (result) {
        res.json({ message: "you already have an account" });
      } else {
        User.create(newUser).then((createdUser) => {
          let random = Math.random().toString(36).slice(-8);
          console.log(createdUser);
          Verification.create({
            authId: createdUser._id,
            secretKey: random,
          })
            .then(() => {
              sendMail(
                createdUser.email,
                "verify email",
                `Hello, This email address: ${createdUser.email} is used to register in Mock Library. To verify your account please click on <a href="http://localhost:5001/user/verify?authId=${createdUser._id}&secretKey=${random}">this link</a>
                        Thanks,
                        Your nöix Team.`
              );
            })
            .then((result) =>
              res.json({ msg: "please check your email to verify" })
            )
            .catch((error) => console.log(error));
        });
      }
    })
    .catch((error) => console.log(error));
};

const emailVerify = (req, res) => {
  console.log(req.query);

  Verification.findOne(req.query).then((result) => {
    if (result) {
      User.updateOne(
        {
          _id: result.authId,
        },
        { verified: true }
      ).then(() => {
        Verification.deleteOne(result)
          .then(() => {
            res.writeHead(302, {
              location: "http://localhost:3000/",
            });
            res.end();
          })
          .catch((err) => console.log(err));
      });
    } else {
      res.json({ msg: "verification not successful." });
    }
  });
};

const login = (req, res) => {
  const loginData = req.body;
  User.findOne({ email: loginData.email }).then((result) => {
    if (result != null) {
      if (result.verified === true) {
        bcrypt.compare(loginData.password, result.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ result }, process.env.PRIVATEKEY, {
              algorithm: "HS256",
            });
            req.session.user = result;
            req.session.save();
            res.json({
              msg: "password valid",
              token,
              result,
            });
          } else {
            res.json({
              msg: "wrong password",
            });
          }
        });
      } else {
        res.json({
          msg: "please verify your account",
        });
      }
    } else {
      res.json({
        msg: "please enter a valid email address",
      });
    }
  });
};

module.exports = { createUser, emailVerify, login };
