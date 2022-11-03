const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/checkLoggedIn')
const {sendMessage, allMessages, setMessageToRead, fetchAllMessages} = require('../controllers/messageController')
 
router.post('/', auth, sendMessage);
router.get('/all', auth, fetchAllMessages);
router.get('/:chatId', auth, allMessages);
router.patch('/read', auth, setMessageToRead);
// router.post('/initialmessage', auth, initialMessage)

module.exports = router;