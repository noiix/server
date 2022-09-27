const express = require('express');
const router = express.Router();
const {upload, getAllTracksByUser} = require('../controllers/musicController')

router.get('/', (req, res) => {
    res.json('this is from the dataRouter')
})

router.post('/upload', upload)
router.get('/all', getAllTracksByUser)

module.exports = router;