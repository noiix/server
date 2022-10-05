<<<<<<< HEAD
const server = require('../server')
=======
const server = require("../server");
>>>>>>> 310262c1849238c8a25edab442ce40e8aacd6ed2
// const io = require('socket.io')(server)

const connect = () => {
  io.on("connection", (socket) => {
    console.log("User connected");
    console.log(socket.handshake.query.userName);

    socket.join(socket.handshake.query.userName);

    // socket.on('userMessage', messageInfo => {
    //     console.log(messageInfo)

    //     io.emit('messageFromSender', messageInfo)
    // })

    socket.on("receivingUser", (messageInfo) => {
      console.log(messageInfo);
      socket.on(messageInfo.to).emit("messageFromServer", messageInfo);
    });

    io.ermit("user", socket.handshake.query.userName);
  });
};

module.exports = { connect };
