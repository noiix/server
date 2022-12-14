const express = require('express');
const router = express.Router();
const {getAllMyTracks, audioUpload, deleteTrack, getAllMyFavorites} = require('../controllers/musicController')
const {auth} = require('../middleware/checkLoggedIn')
const multer = require('multer')
const upload = multer();
const { body } = require("express-validator");


router.post('/upload', auth, upload.single('file'), audioUpload)
router.get('/mysongs', auth, getAllMyTracks)
router.get('/favorites', auth, getAllMyFavorites)
router.patch('/delete', auth, deleteTrack)

module.exports = router;