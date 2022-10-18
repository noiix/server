const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/checkLoggedIn')
const {sendMessage, allMessages} = require('../controllers/messageController')
 
router.post('/', auth, sendMessage);
router.get('/:chatId', auth, allMessages)

module.exports = router;