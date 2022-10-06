const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const {
  createUser,
  emailVerify,
  login,
  getAllMusicByUser,
  googleAuthController,
  logout,
  profileUpdate,
  getNearByUsers,
  checkGenreByUser,
} = require("../controllers/userController");
const { body } = require("express-validator");
const { auth } = require("../middleware/checkLoggedIn");

router.get("/", (req, res) => {
  res.json("this is from userRouter");
});

// create account route
router.post(
  "/create",
  [
    body("username")
      .isLength({ min: 2 })
      .withMessage("Please, provide your username.")
      .custom((value) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject("Username is already in use.");
          }
        });
      }),
    body("email")
      .isEmail()
      .withMessage("Please, provide a valid email address.")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Good news: you already have an account.");
          }
        });
      }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  createUser
);
router.get("/verify", emailVerify);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please, provide your email address to login."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  login
);

router.get("/logout", logout);
router.get("/all", getAllMusicByUser);

router.post("/googleauth", googleAuthController);

router.patch("/profile/edit", auth, profileUpdate);

router.get("/all", getNearByUsers);

router.get("/checkifchecked", auth, checkGenreByUser);

// router.get('/userId/tracks', getAllTracks)

module.exports = router;
