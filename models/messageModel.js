const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    sender: {type: Schema.Types.ObjectId,
        ref: 'User', required: true},
    content: {type: String, required: [true, 'content is required']},
    chat: {type: Schema.Types.ObjectId, ref: 'Chat'}, 
    read: {type: Boolean, default: false}
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message;