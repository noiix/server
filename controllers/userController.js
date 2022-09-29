const User = require("../models/userModel");
const Music = require("../models/musicModel");
const Verification = require("../models/verificationModel");
const bcrypt = require("bcrypt");
const { sendMail } = require("../models/emailModel");
const jwt = require("jsonwebtoken");
const unirest = require("unirest");

const createUser = (req, res) => {
  const newUser = req.body;
  User.findOne({ email: newUser.email })
    .then((result) => {
      if (result) {
        res.json({
          notification: {
            title: "you already have an account",
            type: "warning",
          },
        });
      } else {
        User.create(newUser).then((createdUser) => {
          let random = Math.random().toString(36).slice(-8);
          console.log(createdUser.verified);
          Verification.create({
            authId: createdUser._id,
            secretKey: random,
          })
            .then(() => {
              !createdUser.verified &&
                sendMail(
                  createdUser.email,
                  "verify email",
                  `Hello, This email address: ${createdUser.email} is used to register in Mock Library. To verify your account please click on <a href="http://localhost:5001/user/verify?authId=${createdUser._id}&secretKey=${random}">this link</a>
                        Thanks,
                        Your nöix Team.`
                );
            })
            .then((result) =>
              res.json({
                notification: {
                  title: "please check your email to verify your account",
                  type: "info",
                },
              })
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
      res.json({
        notification: {
          title: "verification not successful.",
          type: "success",
        },
      });
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

            const apiCall = unirest(
              "GET",
              "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/"
            );
            apiCall.headers({
              "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
              "x-rapidapi-key":
                "e470fe30c8mshec14cb43e486919p1ab1afjsna76d56764b44",
            });
            apiCall.end(function (location) {
              if (res.error) throw new Error(location.error);
              console.log(location.body);
              res.json({
                notification: { title: "password valid", type: "info" },
                token,
                result,
                location,
              });
            });
          } else {
            res.json({
              notification: { title: "wrong password", type: "error" },
            });
          }
        });
      } else {
        res.json({
          notification: {
            title: "please verify your account",
            type: "warning",
          },
        });
      }
    } else {
      res.json({
        notification: {
          title: "please enter a valid email address",
          type: "error",
        },
      });
    }
  });
};

const getAllUsers = (req, res) => {
  if (req.session.user) {
    User.find()
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  }
};

const getAllMusicByUser = (req, res) => {
  if (req.session.user) {
    Music.find()
      .populate("artist")
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  }
};

module.exports = {
  createUser,
  emailVerify,
  login,
  getAllUsers,
  getAllMusicByUser,
};

// ------CODE FROM MOSTAFA-------

// const createUser = (req, res) => {
//     const newUser = req.body;
//                 User.create({...newUser, verified: true}).then(() => {
//                     // create a folder named "email" inside the uploads folder in private case
//                     fs.mkdir(path.join(__dirname, '../uploads/' + newUser.email), (err) => {
//                         if(err) {
//                             res.json(err)
//                         }
//                         else {
//                             res.json('done')
//                         }
//                     })

//                     // in public case: store the file inside the folder "music"

//                 })

// const login = (req, res) => {
//     let user = req.body;
//     User.findOne({email: user.email})
//         .then(result => {
//             if(result !== null){
//                 console.log(result)
//                 if(result.verified === true) {
//                     bcrypt.compare(user.password, result.password, (err, data) => {
//                         if(err) {
//                             res.json(err)
//                         }
//                         else{
//                             req.session.user = result;
//                             res.json(result)
//                         }
//                     })
//                 }
//                 else {
//                     res.json('user not verified')
//                 }
//             }else {
//                 res.json('error, user doesn"t exist')
//             }
//         })
// }

// module.exports = {createUser, login}

//----------------------------------------------------------------
