const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    sender: {type: Schema.Types.ObjectId,
        ref: 'User', required: true},
    recipient: {type: Schema.Types.ObjectId,
            ref: 'User', required: true},
    content: {type: String, required: [true, 'title is required']},
    read: {type: Boolean}
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message;