const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const musicSchema = new Schema({
    artist: {type: Schema.Types.ObjectId,
        ref: 'User', required: true},
    title: {type: String, required: [true, 'title is required']},
    public_id: {type: String},
    path: {type: String, required: true},
    private: {type: Boolean},
})

const Music = mongoose.model('Music', musicSchema)

module.exports = Music;