const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {type: String, required: [true, 'username is required'], unique: [true, 'username must be unique'], minlength: [3, 'username must be at least 3 characters'], trim: true},
    email: {type: String, required: [true, 'email is required'],  match: [/.+\@.+\..+/, 'Please use a valid email address'], unique: [true, 'account already exists'], trim: true},
    password: {type: String, minlength: [6, 'password must be at least 6 characters']},
    verified: {type: Boolean, default: false},
    image: {type: String},
    createdAt: {type: Date},
    music_id:[]
})

userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword
        next()
    }catch(err) {
        next(err)
    }
});

const User = mongoose.model('User', userSchema)

module.exports = User;