const Music = require('../models/musicModel')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const audioUpload = (req, res) => {
    
    let fileName = req.file.originalname;
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
                            artist: req.session.user._id,
                            title: req.body.title,
                            path: resultUrl,
                            private: false,
                            sharedWith: []
                            }
                    Music.create(musicFile).then((data) => {
                        res.json(data)}).catch(err => res.json(err))
                    
                });
            }
        }
    )
}


// const upload = (req, res) => {
//     // input file = musicFile
//     let fileName = req.files.musicFile.name;
//     req.files.musicFile.mv(path.join(__dirname, `../uploads/${req.session.user.email}/${fileName}`), error=>{
//         if(error){
//             // error saving the file handler here...
//             res.json(error)
//         }else{
//             // success, file was saved
//             let musicFile = {
//                 artist: req.session.user._id,
//                 title: req.body.title,
//                 path: `/uploads/${req.session.user.email}/${fileName}`,
//                 private: false,
//                 sharedWith: []
//             }
//             Music.create(musicFile).then((result) => {
//                 res.json(result)
//             }).catch(err => res.json(err))
//         }
//     })
// }

const getAllMyTracks = (req, res) => {
   Music.find({artist: req.session.user._id})
   .then((musics) => {
    res.json(musics)
   })
   .catch(err => res.json(err))
}


const getAllTracks = (req, res) => {
    if(req.session.user) {
        Music.find().then().catch()
    }
}



module.exports = {getAllTracks, audioUpload, getAllMyTracks}
