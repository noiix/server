const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const sendMessage = asyncHandler(async (req, res) => {
    const {content, chatId} = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    let newMessage = {
        sender: req.user.result._id,
        content: content,
        chat: chatId
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate('sender', 'username image');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'username image email'
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: message});
        res.json(message)
    }catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const allMessages = asyncHandler(async (req, res) => {
    try{
        const messages = await Message.find({chat: req.params.chatId}).populate('sender', 'username image email').populate('chat');

        res.json(messages);
    }catch(error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const setMessageToRead = (req, res) => {
    const chat = req.body;
     Message.updateMany({chat: chat.chatId}, {read: true}, {new: true}).populate('sender', 'username image email').populate('chat').then(result => res.json(result))
}

const fetchAllMessages = (req, res) => {
    Message.find().populate('sender', 'username image email').populate('chat').then(result => res.json(result))
}

// const initialMessage = asyncHandler(async(req, res) => {
//     const message = req.body;
//     const chatId = await Chat.find({$and: [{users: {$elemMatch: {_id: req.user.result._id}}}, {users: {$elemMatch: {_id: '635befa7ff5ffbbb5a0458c7'}}}]})
//     console.log('chatId', chatId._id)
//     let newMessage = {
//         sender: '635befa7ff5ffbbb5a0458c7',
//         content: message.content,
//         chat: chatId._id
//     };
//     try {
//         let message = await Message.create(newMessage);
//         message = await message.populate('sender', 'username image');
//         message = await message.populate('chat');
//         message = await User.populate(message, {
//             path: 'chat.users',
//             select: 'username image email'
//         });

//         await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: message});
//         res.json(message)
//     }catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// })


module.exports = {sendMessage, allMessages, setMessageToRead, fetchAllMessages}