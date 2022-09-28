const express = require('express');
const router = express.Router();
const {upload, getAllTracksByUser} = require('../controllers/musicController')
const {checkLoggedIn} = require('../middleware/checkLoggedIn')

router.get('/', (req, res) => {
    res.json('this is from the dataRouter')
})

router.post('/upload', checkLoggedIn, upload)
router.get('/all', checkLoggedIn, getAllTracksByUser)

module.exports = router;