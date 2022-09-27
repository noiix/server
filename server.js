const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const dataRouter = require("./routes/DataRouter");
const chatRouter = require("./routes/ChatRouter");
require("./connections/userDB");
require("./connections/musicDB");
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// session configuration

app.use(
  session({
    secret: process.env.SESSIONKEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 12,
    },
  })
);

//routes

app.get("/", (req, res) => {
  res.json("main page");
});
app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/chat", chatRouter);

// server listen

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
