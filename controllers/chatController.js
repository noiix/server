const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel')

// const server = require('../server')
// const io = require('socket.io')(server)

// const connect = () => {
//   io.on("connection", (socket) => {
//     console.log("User connected");
//     console.log(socket.handshake.query.userName);

//     socket.join(socket.handshake.query.userName);

//     // socket.on('userMessage', messageInfo => {
//     //     console.log(messageInfo)

//     //     io.emit('messageFromSender', messageInfo)
//     // })

//     socket.on("receivingUser", (messageInfo) => {
//       console.log(messageInfo);
//       socket.on(messageInfo.to).emit("messageFromServer", messageInfo);
//     });

//     io.emit("user", socket.handshake.query.userName);
//   });
// };


const accessChat = asyncHandler(async (req, res) => {
  const {userId} = req.body;
  if(!userId) {
    return res.sendStatus(400);
  }
  let isChat = await Chat.find({$and: [{users: {$elemMatch: {$eq: req.user.result._id}}}, {users: {$elemMatch: {$eq: userId}}}]}).populate('users', '-password').populate('latestMessage');
  isChat = await User.populate(isChat, {path: 'latestMessage.sender', select: 'username image email'});

  if(isChat.length > 0) {
    res.json(isChat[0])
  }else {
    let chatData = {
      chatName: 'sender',
      users: [req.user.result._id, userId]

    }
    try{
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({_id: createdChat._id}).populate('users', '-password')
      res.json(FullChat)
    }catch(error){
      res.status(400);
      throw new Error(error.message);
    }
  }
})


const fetchChats = asyncHandler(async(req, res) => {
  try {
    Chat.find({users: {$elemMatch: {$eq: req.user.result._id}}})
    .populate('users', '-password')
    .populate('latestMessage')
    .sort({updatedAt: -1})
    .then(async(results) => {
      results = await User.populate(results, {
        path: 'latestMessage.sender',
        select: 'username image email'
      });
      res.json(results)
    })
  }catch(error) {
    res.status(400);
    throw new Error(error.message);
  }
})

// const initialChatBot = asyncHandler(async(req, res) => {
//     let chatData = {
//       chatName: 'sender',
//       users: [req.user.result._id, '635befa7ff5ffbbb5a0458c7']
//     }
//     try{
//       const chat = await Chat.find({users: {$elemMatch: {$eq: req.user.result._id}}})
//       console.log('is there a initial chat?', chat);
//       if(chat.length === 0){
//         const createdChat = await Chat.create(chatData);
//         const FullChat = await Chat.findOne({_id: createdChat._id}).populate('users', '-password')
//         res.json(FullChat)
//       }
//     }catch(error){
//       res.status(400);
//       throw new Error(error.message);
//     }
// })

module.exports = {accessChat, fetchChats};
