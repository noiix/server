const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const mongoose = require("mongoose");
require("./connections/userDB");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = morgan('tiny');
const userRouter = require("./routes/userRouter");
const musicRouter = require("./routes/musicRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require('./routes/messageRouter');
const errorController = require("./controllers/errorController");
// const { logError } = require("./errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: 'https://noix.onrender.com', credentials: true}));
app.use(cookieParser());

app.use(errorController);

//routes
app.get("/", (req, res) => {
  res.json('E.T. : "Call home"')
});
app.use("/user", userRouter);
app.use("/music", musicRouter);
app.use("/chat", chatRouter);
app.use("/messages", messageRouter);

const server = app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});


const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log("user joined room: " + room)
  });

  socket.on('typing', (room) => {
    socket.in(room).emit('typing', room)
  })

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing')
  })
  

  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if(!chat.users) return console.log("chat.users not defined")

    chat.users.forEach(user => {
      // if(user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit('message received', newMessageReceived);
  })
  });
  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  })

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id)
  })
})

//add comment

