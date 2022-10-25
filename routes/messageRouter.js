const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/checkLoggedIn')
const {sendMessage, allMessages, setMessageToRead} = require('../controllers/messageController')
 
router.post('/', auth, sendMessage);
router.get('/:chatId', auth, allMessages);
router.patch('/read', auth, setMessageToRead);

module.exports = router;