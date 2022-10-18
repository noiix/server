const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const chatSchema = new Schema({
    users: [{type: Schema.Types.ObjectId,
        ref: 'User', required: true}],
    latestMessage: {type: Schema.Types.ObjectId,
        ref: 'Message'}
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat;