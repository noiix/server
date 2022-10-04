const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const mongoose = require("mongoose");
require("./connections/userDB");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/userRouter");
const musicRouter = require("./routes/musicRouter");
const chatRouter = require("./routes/chatRouter");

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



app.get('/', (req, res) => {
    res.json({page:'main page', notification:{title: "Welcome to this amazing app", type: "success"}})
})    
app.use('/user', userRouter);
app.use('/music', musicRouter);
app.use('/chat', chatRouter);


app.get("/", (req, res) => {
  res.json({
    page: "main page",
    notification: { title: "Welcome to this amazing app", type: "success" },
  });
});
app.use("/user", userRouter);
app.use("/music", musicRouter);
app.use("/chat", chatRouter);

// server listen

const server = app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

module.exports = {server}
// audio storage

// const storage = new GridFsStorage({
//     url: process.env.DB_LINK_MUSIC,
//     file: (req, res) => {
//         return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//             if (err) {
//               return reject(err);
//             }
//             const filename = buf.toString('hex') + path.extname(file.originalname);
//             const fileInfo = {
//               filename: filename,
//               bucketName: 'uploads'
//             };
//             resolve(fileInfo);
//           });
//         });
//     }})


// const upload = multer({storage})

