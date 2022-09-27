const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter')
const dataRouter = require('./routes/DataRouter')
const chatRouter = require('./routes/chatRouter')
require('./connections/userDB')
require('./connections/musicDB')
const crypto = require('crypto');
const multer  = require('multer');
// const {GridFsStorage} = require('multer-gridfs-storage');
const path = require('path');

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
    res.json({page:'main page', notification:{title: "Welcome to this amazing app", type: "success"}})
})    
app.use('/user', userRouter);
app.use('/data', dataRouter);
app.use('/chat', chatRouter);




// server listen

app.listen(PORT, () => {
    console.log('listening on port ' + PORT)
});