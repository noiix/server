const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const musicSchema = new Schema({
    artist: {type: Schema.Types.ObjectId,
        ref: 'User', required: true},
    title: {type: String, required: [true, 'title is required']},
    path: {type: String, required: true, unique: true},
    private: {type: Boolean},
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Music = mongoose.model('Music', musicSchema)

module.exports = Music;