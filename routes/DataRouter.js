const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json('this is from the dataRouter')
})

module.exports = router;