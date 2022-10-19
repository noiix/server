const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    sender: {type: Schema.Types.ObjectId,
        ref: 'User', required: true},
    content: {type: String, trim: true},
    chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
    read: {type: Boolean},
}, {timestamps: 
    true
 })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message;