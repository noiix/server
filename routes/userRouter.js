const express = require("express");
const router = express.Router();
const {
  createUser,
  emailVerify,
  login,
} = require("../controllers/userController");

router.get("/", (req, res) => {
  res.json("this is from userRouter");
});

router.post("/create", createUser);

router.get("/verify", emailVerify);

router.post("/login", login);

module.exports = router;
