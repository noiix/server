const User = require("../models/userModel");
const Music = require("../models/musicModel");
const Verification = require("../models/verificationModel");
const bcrypt = require("bcrypt");
const { sendMail } = require("../models/emailModel");
const jwt = require("jsonwebtoken");
const unirest = require("unirest");
const { validationResult } = require("express-validator");
// const {UpdateLastLocation} = require('./utils/updateLocation')

const createUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors.array().map((err) => err.msg));
    console.log(errors.array());
  } else {
    const newUser = req.body;
    User.findOne({ email: newUser.email })
      .then((result) => {
        if (result) {
          res.json({
            notification: {
              title: "Hey, you already have an account",
              type: "info",
            },
          });
        } else {
          User.create(newUser).then((createdUser) => {
            let random = Math.random().toString(36).slice(-8);
            console.log(createdUser);
            Verification.create({
              authId: createdUser._id,
              secretKey: random,
            })
              .then(() => {
                if (createdUser.verified !== true) {
                  sendMail(
                    createdUser.email,
                    "verify email",
                    `Hello, This email address: ${createdUser.email} is used to register in Mock Library. To verify your account please click on <a href="http://localhost:5001/user/verify?authId=${createdUser._id}&secretKey=${random}">this link</a>
                            Thanks,
                            Your nöix Team.`
                  );
                }
              })
              .then((result) =>
                res.json({
                  notification: {
                    title: "Please, check your email to verify your account.",
                    type: "info",
                  },
                })
              )
              .catch((error) => console.log(error));
          });
        }
      })
      .catch((error) => console.log(error));
  }
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
      res.json({
        notification: {
          title: "The verification was not successful.",
          type: "error",
        },
      });
    }
  });
};

const login = (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.send(errors.array().map(err => err.msg));
    console.log(errors.array())
  }else {
    const loginData = req.body;
  User.findOne({ email: loginData.email }).then((result) => {
    if (result != null) {
      if (result.verified === true) {
        bcrypt.compare(loginData.password, result.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ result }, process.env.ACCESS_TOKEN, {
              expiresIn: '1h'
            });
            const apiCall = unirest(
              "GET",
              "https://ip-geo-location.p.rapidapi.com/ip/check"
            );
            apiCall.headers({
              "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
              "x-rapidapi-key": "e470fe30c8mshec14cb43e486919p1ab1afjsna76d56764b44"
            });
            apiCall.end(function(location) {
              if (res.error) throw new Error(location.error);
              User.findOneAndUpdate({email: loginData.email}, {location: location.body}).then(() => {
                console.log('result', result)
                res
                .cookie('token', token, {
                  expires: new Date(Date.now() + 172800000),
                  httpOnly: true,
                })
                .json({
                  notification: {title: "You successfully logged in.", type: "success"},
                  result
                });
              })
              
            });
          } else {
            res.json({notification:
              {title: "Password and email do not match.", type: "error"}
            });
          }
        });
      } else {
        res.json({notification:
         { title: "Please, verify your account.", type: "info"}
        });
      }
    } else {
      res.json({notification:
        {title: "Please, enter a valid email address.", type: "error"}
      });
    }
  }).catch(err => console.log(err))
  }
  
};
  

const getAllUsers = (req, res) => {
  if (req.user) {
    User.find()
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  }
};

const getAllMusicByUser = (req, res) => {
  if (req.user) {
    Music.find()
      .populate("artist")
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  }
};

const getNearByUsers = (req, res) => {
  const currentLocation = req.user.result.location.city.name
  console.log('my location: ', currentLocation)
  User.find({}, {location: currentLocation})
  .then(result => {
    console.log('nearby users', result)
    res.json(result)
  })
  .catch(err => console.log(err))
}

const googleAuthController = (req, res) => {
  let userData = req.body;
  User.findOne({ email: userData.email })
    .then((result) => {
      if (result) {
        const token = jwt.sign({ result }, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
        res
          .cookie("token", token, {
            expires: new Date(Date.now() + 172800000),
            httpOnly: true,
          })
          .json({
            notification: {
              title: "You successfully logged in.",
              type: "success",
            },
            result,
          });
      } else {
        const apiCall = unirest(
          "GET",
          "https://ip-geo-location.p.rapidapi.com/ip/check"
        );
        apiCall.headers({
          "x-rapidapi-host": "ip-geo-location.p.rapidapi.com",
          "x-rapidapi-key":
            "e470fe30c8mshec14cb43e486919p1ab1afjsna76d56764b44",
        });
        apiCall.end(function (location) {
          if (res.error) throw new Error(location.error);
          console.log(location.body);
          userData.location = location.body;
          User.create(userData)
            .then((result) => {
              const token = jwt.sign({ result }, process.env.ACCESS_TOKEN, {
                expiresIn: "1h",
              });
              res
                .cookie("token", token, {
                  expires: new Date(Date.now() + 172800000),
                  httpOnly: true,
                })
                .json({
                  notification: {
                    title: "You successfully logged in.",
                    type: "success",
                  },
                  result,
                });
            })
            .catch((err) => console.log(err));
        });
      }
    })
    .catch((err) => console.log(err));
};

const logout = (req, res, next) => {
  res.clearCookie("token").json({
    notification: {
      title: "You successfully logged out.",
      type: "success",
    },
  });
};

const profileUpdate = (req, res) => {
  const id = req.user.result._id;
  console.log("userid: ", req.user.result._id);
  const update = {
    username: req.body.username,
    genre: req.body.genre,
    instrument: req.body.instrument
  };
  console.log("request body: ", update);

  User.findByIdAndUpdate(id, update, { new: true })
    .then((result) => {
      res.json(result);
      console.log("update result!: ", result);
    })
    .catch((err) => console.log(err));
};

const checkGenreByUser = (req, res) => {
  console.log("req.user: ", req.user);
  User.findOne({ _id: req.user.result._id })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  createUser,
  emailVerify,
  login,
  logout,
  getAllUsers,
  getAllMusicByUser,
  googleAuthController,
  profileUpdate,
  getNearByUsers,
  checkGenreByUser
};
