const express = require('express');
const router = express.Router();
const {getAllMyTracks, audioUpload} = require('../controllers/musicController')
const {auth} = require('../middleware/checkLoggedIn')
const multer = require('multer')
const upload = multer();


router.post('/upload', auth, upload.single('file'), audioUpload)
router.get('/mysongs', getAllMyTracks)

module.exports = router;