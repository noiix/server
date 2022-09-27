const {User} = require('../connections/userDB')
const {Music} = require('../connections/musicDB')

const createUser = (req, res) => {
    const newUser = req.body;
    User.findOne({email: newUser.email})
        .then((result) => {
            if(result) {
                res.json({notification:{type: 'info', title: 'You already have an account.'}})
            }
            else {
                User.create(newUser).then(() => res.json({notification: {title: 'Your account has been successfully created.', type: 'success'}}))
            }
            
        })
}

const getAllTracks = (req, res) => {
    const currentUser = User.findOne({_id: req.params.userId})
    const idArray = currentUser.music_id;
    for(let i = 0; i < idArray.length; i++){
        Music.findOne({_id: idArray[i]})

    }


}

module.exports = {createUser, getAllTracks}