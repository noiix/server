const Music = require('../models/musicModel')
const fs = require('fs')
const path = require('path')

const upload = (req, res) => {
    // input file = musicFile
    let fileName = req.files.musicFile.name;
    req.files.musicFile.mv(path.join(__dirname, `../uploads/${req.session.user.email}/${fileName}`), error=>{
        if(error){
            // error saving the file handler here...
            res.json(error)
        }else{
            // success, file was saved
            let musicFile = {
                artist: req.session.user._id,
                title: req.body.title,
                path: `/uploads/${req.session.user.email}/${fileName}`,
                private: false,
                sharedWith: []
            }
            Music.create(musicFile).then((result) => {
                res.json(result)
            }).catch(err => res.json(err))
        }
    })
}

const getAllTracksByUser = (req, res) => {
   Music.find({artist: req.session.user._id})
   .then((musics) => {
    res.json(musics)
   })
   .catch(err => res.json(err))
}



const getAllTracks = (req, res) => {
    //origin:5000/museics/userId/
    // origin:5000/musics?user=userId
    if(req.session.user) {
        Music.find().then().catch()
    }
}

module.exports = {upload, getAllTracksByUser}