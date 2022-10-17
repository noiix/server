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
const userRouter = require("./routes/userRouter");
const musicRouter = require("./routes/musicRouter");
const chatRouter = require("./routes/chatRouter");
const errorController = require("./controllers/errorController");
// const proxy = require('http-proxy-middleware')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());
// session configuration

// app.use(
//   session({
//     secret: process.env.SESSIONKEY,
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 12,
//     },
//   })
// );

app.use(errorController);

//routes
app.get("/", (req, res) => {
  console.log('E.T. : "Call home"')
});
app.use("/user", userRouter);
app.use("/music", musicRouter);
// app.use("/chat", chatRouter);


// server listen

// const socketProxy= createProxyMiddleware('/socket', {
//   target: 'http://localhost:5001',
//   changeOrigin: true,
//   ws: true, 
//   logLevel: 'debug',
// });

// app.use(proxy('/socket.io', {
//   target: 'http://localhost:5001',
//   ws: true
// }));


const server = app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

const io = require('socket.io')(server);

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

  io.emit("user", socket.handshake.query.userName);
});
