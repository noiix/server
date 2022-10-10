const Music = require('../models/musicModel')
const User = require('../models/userModel')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const audioUpload = (req, res) => {
        // save file to upload temporarily in uploads dir
    let fileName = req.file.originalname;
    console.log('req.file', req.body)
    let uploadLocation = path.join( __dirname + '/../uploads/' + fileName);

    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));

    cloudinary.uploader.upload(
        uploadLocation,
        {resource_type: "video", folder: `audiofiles/`, overwrite: true, public_id: fileName},
        (error, result) => {
            if(error) res.status(500).json(error);
            else {
                fs.unlink(uploadLocation, (deleteErr) => {
                    if(deleteErr) res.json({notification: {title: 'error occured', type: 'error'}})
                        let resultUrl = result.secure_url
                        console.log('temp file was deleted');
                        let musicFile = {
                            artist: req.user.result._id,
                            title: req.body.title,
                            path: resultUrl,
                            private: false,
                            }
                    Music.findOne({path: resultUrl}).then((result) => {
                        if(result){
                            res.json({notification: {title: 'You already uploaded this song', type: 'info'}})
                        }
                        else {
                            Music.create(musicFile).then((data) => {
                                User.findOneAndUpdate({_id: data.artist}, {$push: {music: data._id}}).then((result) => {
                                    res.json({result, notification: {title: 'You successfully uploaded your song. Well done.', type:'success'}})}).catch(err => res.json(err)) 
                                })
                        }
                    });
                         
                });
            }
        }
    )
}


const getAllMyTracks = (req, res) => {
   Music.find({artist: req.user.result._id})
   .then((musics) => {
    if(musics.length > 0) {
        res.json(musics)
    }
     
   })
   .catch(err => res.json(err))
}


const getAllTracks = (req, res) => {
    if(req.user.result) {
        Music.find().then(result => res.json(result)).catch(err => console.log(err))
    }
}


module.exports = {getAllTracks, audioUpload, getAllMyTracks}
