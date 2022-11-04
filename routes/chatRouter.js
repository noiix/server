const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/checkLoggedIn')
const {accessChat, fetchChats} = require('../controllers/chatController')


// router.get('/', (req, res) => {
//    res.send('Api is running')
// })

// router.get('/:id', (req, res) => {
//    console.log(req.body.params.id)
// })

router.post('/', auth, accessChat);
router.get('/', auth, fetchChats);
// router.get('/chatbot', auth, initialChatBot)

module.exports = router;