const User = require("../models/userModel");
const Music = require("../models/musicModel");
const Verification = require("../models/verificationModel");
const bcrypt = require("bcrypt");
const { sendMail } = require("../models/emailModel");
const jwt = require("jsonwebtoken");
const unirest = require("unirest");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const { response } = require("express");
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const createUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let notification = errors
      .array()
      .map((err) => ({ title: err.msg, type: "error" }));
    res.json(notification);
    console.log(notification);
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
                    `Hello, This email address: ${createdUser.email} is used to register in Noix. To verify your account please click on <a href="https://noix-server.onrender.com/user/verify?authId=${createdUser._id}&secretKey=${random}">this link</a>
                            Thanks,
                            Your nöix Team.`
                  );
                }
              })
              .then((result) =>
                res.status(200).json({
                  notification: {
                    title: "Please, check your email to verify your account.",
                    type: "info",
                    status: "ok"
                  },
                  
                })
              )
              .catch((error) => {
                const err = error.map((err) => {
                  ({ title: err.msg, type: "error" })
                })
                
                res.status(200).json(
                  err
                )
                console.log(error)
              });
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
              location: "https://noix-client.vercel.app/",
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
  console.log('login controller')
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors.array().map((err) => err.msg));
    console.log(errors.array());
  } else {
    const loginData = req.body;
    User.findOne({ email: loginData.email })
      .then((result) => {
        if (result != null) {
          if (result.verified === true) {
            bcrypt.compare(
              loginData.password,
              result.password,
              (err, response) => {
                if (response) {
                  const token = jwt.sign({ result }, process.env.ACCESS_TOKEN, {
                    expiresIn: "1h",
                  });
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
                    User.findOneAndUpdate(
                      { email: loginData.email },
                      { location: location.body }
                    ).populate('music').populate('liked_songs').then((info) => {
                      console.log("result", result);
                      res
                        .cookie("token", token, {
                          expires: new Date(Date.now() + 172800000),
                          httpOnly: true,
                        })
                        .status(200)
                        .json({
                          notification: {
                            title: "You successfully logged in.",
                            type: "success",
                          },
                          info,
                        });
                    });
                  });
                } else {
                  res.json({
                    notification: {
                      title: "Password and email do not match.",
                      type: "error",
                    },
                  });
                }
              }
            );
          } else {
            res.json({
              notification: {
                title: "Please, verify your account.",
                type: "info",
              },
            });
          }
        } else {
          res.json({
            notification: {
              title: "Please, enter a valid email address.",
              type: "error",
            },
          });
        }
      })
      .catch((err) => console.log(err));
  }
};

// const getAllUsers = (req, res) => {
//   if (req.user) {
//     User.find()
//       .then((result) => res.json(result))
//       .catch((err) => res.json(err));
//   }
// };

const getNearByUsers = (req, res) => {
  User.findById(req.user.result._id).then(result => {
    User.find({
      $and: [
        { "location.city.name": result.location.city.name },
        { genre: { $elemMatch: { $in: result.genre } } },
      ],
    })
      .populate("music")
      .then((result) => {
        if(result && result.length > 0) {
          console.log("users with music", result);
          res.status(200).json({result});
        }
        else {
          res.json({result, notification: {title: "Select your favorite genres to see like-minded users nearby!", type: "info"}})
        }
      })
      .catch((err) => console.log(err));
  })
  
};

const googleAuthController = (req, res) => {
  console.log('login controller')
  let userData = req.body;
  User.findOne({ email: userData.email }).populate('music').populate('liked_songs')
    .then((result) => {
      if (result) {
        const token = jwt.sign({ result }, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
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
          User.findOneAndUpdate(
            { email: userData.email },
            { location: location.body }
          ).populate('music').populate('liked_songs').then(() => {
            // console.log("result", result);
            res
              .cookie("token", token, {
                expires: new Date(Date.now() + 172800000),
                httpOnly: true,
              })
              .status(200)
              .json({
                notification: {
                  title: "You successfully logged in.",
                  type: "success",
                },
                result,
              });
          });
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
          // console.log(location.body);
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
                  result
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
    // username: req.body.username,
    genre: req.body.genre,
    instrument: req.body.instrument,
  };

  User.findByIdAndUpdate(id, update, { new: true }).populate('music').populate('liked_songs')
    .then((result) => {
      res.status(200).json(result);
      // console.log("update result!: ", result);
    })
    .catch((err) => console.log(err));
};

const profileUpdateName = (req, res) => {
  const id = req.user.result._id;
  const name = {
    username: req.body.username
  }
  console.log('name update:', name)
  User.findByIdAndUpdate(id, name, {new: true}).populate('music').populate('liked_songs')
  .then((result) => {
    res.status(200).json(result)
  }).catch(err => console.log(err))
}


const checkGenreByUser = (req, res) => {
  console.log("req.user: ", req.user);
  User.findOne({ _id: req.user.result._id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const pictureUpdate = (req, res) => {
  let fileName = req.file.originalname;
  let uploadLocation = path.join(__dirname + "/../uploads/" + fileName);

  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  );

  cloudinary.uploader.upload(
    uploadLocation,
    {
      resource_type: "image",
      folder: `images/`,
      public_id: fileName,
      overwrite: true,
    },
    (error, result) => {
      if (error) res.status(500).json(error);
      else {
        fs.unlink(uploadLocation, (deleteError) => {
          if (deleteError) res.status(500).send(deleteError);
          let resultUrl = result.secure_url;
          User.findOneAndUpdate(
            { _id: req.user.result._id },
            { image: resultUrl }, {new: true}
          ).populate('music').populate('liked_songs')
            .then((result) => {
              res.status(200).json({
                result,
                notification: {
                  title: "successfully updated profile picture",
                  type: "success",
                },
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    }
  );
};

const addToLikedSongs = (req, res) => {
  const songToLike = req.body
  User.findById(req.user.result._id).then(result => {
    if(!result.liked_songs.includes(songToLike._id)) {
      User.findByIdAndUpdate(req.user.result._id, {$push: {liked_songs: songToLike._id}}, {new: true}).populate('liked_songs').populate('music').then(data => {
        // console.log('updated user', data)
        res.json({data, notification: {title: 'You added a new favorite song.', type: 'success'}})
      })
    }
    else {
      User.findByIdAndUpdate(req.user.result._id, {$pull: {liked_songs: songToLike._id}}, {new: true}).populate('liked_songs').populate('music').then(data => {
        // console.log('delete user updated', data)
        res.json({data, notification: {title: 'You deleted a favorite song.', type: 'success'}})
      })
    }
  })
}

const introTextUpdate = (req, res) => {
  let newText = req.body;
  console.log('newText', req.body);
  User.findByIdAndUpdate(req.user.result._id, newText, {new: true})
  .populate('music').populate('liked_songs')
            .then((result) => {
              res.json({
                result,
                notification: {
                  title: "successfully updated your info text",
                  type: "success",
                },
              });
            })
            .catch((err) => {
              console.log(err);
            });
}

const removeFromLikedSongs = (req, res) => {
  let song = req.body

   User.findByIdAndUpdate(req.user.result._id, {$pull: {liked_songs: song._id}}, {new: true}).populate('liked_songs').populate('music').then(data => {
   res.json({data, notification: {title: 'You deleted a favorite song.', type: 'success'}})
  })
}

const getAllMyContacts = (req, res) => {
  User.findById(req.user.result._id).populate('music').populate('liked_songs')
  .then(result => {
    res.json(result)
  })
}

const addContact = (req, res) => {
  const contact = req.body;
  User.findById(req.user.result._id).then(result => {
    if(!result.contacts.includes(contact.contactId)) {
      User.findByIdAndUpdate(req.user.result._id, {$push: {contacts: contact.contactId}}, {new: true}).populate('liked_songs').populate('music').populate('contacts').then(data => {
        // console.log('updated user', data)
        res.json({data, notification: {title: 'You added a new contact.', type: 'success'}})
      })
    }
  })
}

module.exports = {
  createUser,
  emailVerify,
  login,
  logout,
  // getAllUsers,
  googleAuthController,
  profileUpdate,
  getNearByUsers,
  checkGenreByUser,
  pictureUpdate,
  addToLikedSongs,
  introTextUpdate,
  removeFromLikedSongs,
  getAllMyContacts,
  addContact,
  profileUpdateName
};
