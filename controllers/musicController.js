const Music = require('../models/musicModel')
const User = require('../models/userModel')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const jwt = require('jsonwebtoken')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const audioUpload = (req, res) => {
    // decode jtw token to get currentUser
    // const decodedUser = jwt.decode(req.user);
    // console.log(decodedUser);
    console.log('req.user', req.user)
    console.log('req.file')

    // save file to upload temporarily in uploads dir
    let fileName = req.file.originalname;
    console.log('req.file', req.body)
    let uploadLocation = path.join( __dirname + '/../uploads/' + fileName);

    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));

    cloudinary.uploader.upload(
        uploadLocation,
        {resource_type: "raw", folder: `audiofiles/`, overwrite: true},
        (error, result) => {
            if(error) res.status(500).json(error);
            else {
                fs.unlink(uploadLocation, (deleteErr) => {
                    if(deleteErr) res.status(500).send(deleteErr);
                    // res.status(200).json({fileUrl: result.secure_url});
                        let resultUrl = result.secure_url
                        console.log('temp file was deleted');
                        let musicFile = {
                            artist: req.user.result._id,
                            title: req.body.title,
                            path: resultUrl,
                            private: false,
                            }
                    Music.create(musicFile).then((data) => {
                        User.findOneAndUpdate({_id: data.artist}, {$push: {music: data._id}}).then(() => {
                            res.json({data, notification: {title: 'You successfully uploaded your song. Well done.', type:'success'}})}).catch(err => res.json(err)) 
                        })
                         
                });
            }
        }
    )
}

const getAllMyTracks = (req, res) => {
   Music.find({artist: req.user.result._id})
   .then((musics) => {
    res.json(musics)
   })
   .catch(err => res.json(err))
}


const getAllTracks = (req, res) => {
    if(req.user.result) {
        Music.find().then(result => res.json(result)).catch(err => console.log(err))
    }
}



module.exports = {getAllTracks, audioUpload, getAllMyTracks}
