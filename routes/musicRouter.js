const express = require('express');
const router = express.Router();
const {getAllMyTracks, audioUpload} = require('../controllers/musicController')
// const {checkLoggedIn} = require('../middleware/checkLoggedIn')
const multer = require('multer')
const upload = multer();


<<<<<<< HEAD
router.post('/upload', checkLoggedIn, upload)
// router.get('/all', checkLoggedIn, getAllTracksByUser)
=======
router.post('/upload', upload.single('file'), audioUpload)
router.get('/mysongs', getAllMyTracks)
>>>>>>> 1edf265b9325926707c4df8bed22932c229be5ac

module.exports = router;