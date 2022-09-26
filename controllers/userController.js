const {User} = require('../connections/userDB')
const {Data} = require('../connections/musicDB')

const createUser = (req, res) => {
    const newUser = req.body;
    User.findOne({email: newUser.email})
        .then((result) => {
            if(result) {
                res.json({message: 'you already have an account'})
            }
            else {
                User.create(newUser).then(() => res.json({message: 'account created'}))
            }
            
        })
}

const getAllTracks = (req, res) => {
    const currentUser = User.findOne({_id: req.params.userId})
    const idArray = currentUser.music_id;
    for(let i = 0; i < idArray.lenght; i++){
        Data.findOne({_id: idArray[i]})

    }


}

module.exports = {createUser, getAllTracks}