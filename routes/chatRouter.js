const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/checkLoggedIn')
const {accessChat, fetchChats, initialChatBot} = require('../controllers/chatController')


router.post('/', auth, accessChat);
router.get('/', auth, fetchChats);
// router.get('/chatbot', auth, initialChatBot)

module.exports = router;