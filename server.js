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

const server = app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
