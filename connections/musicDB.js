const mongoose = require('mongoose');

const musicDB = mongoose.createConnection(process.env.DB_LINK_MUSIC ,(err) => {
    if(err) throw err;
    console.log('music db is connected')
});
const Music = musicDB.model('Music', require('../models/musicModel'))

module.exports = {musicDB, Music};