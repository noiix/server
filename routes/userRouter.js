const express = require("express");
const router = express.Router();

const {createUser, emailVerify, login} = require('../controllers/userController')

router.get("/", (req, res) => {
  res.json("this is from userRouter");
});

// CODE FROM MOSTAFA
// router.post("/create", createUser);
// router.get('/userId/tracks')
// router.post('/login', login)


router.get("/verify", emailVerify);
router.post("/create", createUser);
router.post("/login", login);

// router.get('/userId/tracks', getAllTracks)

module.exports = router;
