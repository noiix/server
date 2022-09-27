const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter')
const musicRouter = require('./routes/musicRouter')
const chatRouter = require('./routes/ChatRouter')
require('./connections/userDB')
const crypto = require('crypto');
// const {GridFsStorage} = require('multer-gridfs-storage');
const path = require('path')
const session = require('express-session');
const fileUpload = require('express-fileupload')

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'any-string'
}))

app.use(fileUpload());


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


app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cors());

//routes

app.get('/', (req, res) => {
    res.json('main page')
})    
app.use('/user', userRouter);
app.use('/music', musicRouter);
app.use('/chat', chatRouter);




// server listen

app.listen(PORT, () => {
    console.log('listening on port ' + PORT)
});