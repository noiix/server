const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const musicSchema = new Schema({
    artist: {type: String, required: [true, 'artist name required']},
    title: {type: String, required: [true, 'title is required']}
})

module.exports = musicSchema;