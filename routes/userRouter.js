const express = require('express');
const router = express.Router();
const {createUser} = require('../controllers/userController')

router.get('/', (req, res) => {
    res.json('this is from userRouter')
})

router.post('/create', createUser)

module.exports = router;