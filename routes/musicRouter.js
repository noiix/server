const express = require('express');
const router = express.Router();
const {getAllMyTracks, audioUpload, deleteTrack} = require('../controllers/musicController')
const {auth} = require('../middleware/checkLoggedIn')
const multer = require('multer')
const upload = multer();


router.post('/upload', auth, upload.single('file'), audioUpload)
router.get('/mysongs', auth, getAllMyTracks)
router.patch('/delete', auth, deleteTrack)

module.exports = router;