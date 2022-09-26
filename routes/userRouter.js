const express = require('express');
const router = express.Router();
const {createUser, getAlltracks} = require('../controllers/userController')

router.get('/', (req, res) => {
    res.json('this is from userRouter')
})

router.post('/create', createUser)

router.get('/userId/tracks', getAlltracks)

module.exports = router;