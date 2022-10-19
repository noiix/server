const Music = require('../models/musicModel')
const User = require('../models/userModel')
const fs = require('fs')
const path = require('path')
const { validationResult } = require("express-validator");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const audioUpload = (req, res) => {
    User.findById(req.user.result._id).then((info)=> {
            if(info.music.length > 2) {
                res.json({notification: {title: 'You can have maximum three songs on your profile', type: 'error'}})
            }
            else {
                let fileName = req.file.originalname;
                console.log('req.file', req.body)
                let uploadLocation = path.join( __dirname + '/../uploads/' + fileName);
            
                fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));
            
                cloudinary.uploader.upload(
                    uploadLocation,
                    {resource_type: "video", folder: `audiofiles/`, overwrite: true, public_id: fileName, video_metadata: true},
                    (error, result) => {
                        if(error) res.status(500).json(error);
                        else {
                            fs.unlink(uploadLocation, (deleteErr) => {
                                if(deleteErr) res.json({notification: {title: 'error ocurred', type: 'error'}})
                                    let resultUrl = result.secure_url
                                    console.log('temp file was deleted');
                                    let musicFile = {
                                        artist: req.user.result._id,
                                        title: req.body.title,
                                        public_id: fileName,
                                        path: resultUrl,
                                        private: false,
                                        }
                                        Music.create(musicFile).then((data) => {
                                            User.findOneAndUpdate({_id: data.artist}, {$push: {music: data._id}}, {new: true}).populate('music').then((result) => {
                                                res.json({result, notification: {title: 'You successfully uploaded your song. Well done.', type:'success'}})}).catch(err => res.json(err)) 
                                            })        
                            });
                        }
                    }
                )
            }
        
    }).catch(err => {
        if(err.name === "ValidationError"){
            let errors = {};
            Object.keys(err.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.json({notification: errors});
        }
        res.json({notification: {title: err.errors, type: 'error'}})
    })
   
    
}

const deleteTrack = (req, res) => {
    const songObj = req.body;
    console.log('song object', songObj)
    cloudinary.uploader.destroy(`audiofiles/${songObj.deleteSong.public_id}`, {"resource_type": "video"})
    User.findOneAndUpdate({_id: req.user.result._id}, {music: songObj.newSongList}, {new: true}).populate('music')
    .then(result => {
        Music.findByIdAndDelete(songObj.deleteSong._id).then(() => {
            res.json({result, notification: {title: 'You deleted one song', type: 'success'}})
        })
    }).catch()
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

const getAllMyFavorites = (req, res) => {
  User.findById(req.user.result._id).populate('liked_songs')
  .then(result => {
    if(result.liked_songs.length > 0) {
        res.json(result)
    } 
  })
}


module.exports = {getAllTracks, audioUpload, getAllMyTracks, deleteTrack, getAllMyFavorites}
