const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const mongoose = require("mongoose");
require("./connections/userDB");
const session = require("express-session");
<<<<<<< HEAD
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
=======
const cookieParser = require("cookie-parser");
>>>>>>> 310262c1849238c8a25edab442ce40e8aacd6ed2
const userRouter = require("./routes/userRouter");
const musicRouter = require("./routes/musicRouter");
const chatRouter = require("./routes/chatRouter");

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

//routes

app.get("/", (req, res) => {
  res.json({
    page: "main page",
    notification: { title: "Welcome to this amazing app", type: "success" },
  });
});
app.use("/user", userRouter);
app.use("/music", musicRouter);
// app.use("/chat", chatRouter);

// server listen

const server = app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
