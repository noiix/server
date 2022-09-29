const express = require("express");
const router = express.Router();

const {createUser, emailVerify, login, getAllMusicByUser} = require('../controllers/userController')

router.get("/", (req, res) => {
  res.json("this is from userRouter");
});


router.get("/verify", emailVerify);
router.post("/create", createUser);
router.post("/login", login);
router.get("/all", getAllMusicByUser)


// router.get('/userId/tracks', getAllTracks)

module.exports = router;
