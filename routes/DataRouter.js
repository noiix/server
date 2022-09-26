const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();

router.get('/', (req, res) => {
    res.json('this is from the dataRouter')
})

router.post('/upload', upload.single('track'), (req, res, next) => {
    res.json(req.track)
})

module.exports = router;