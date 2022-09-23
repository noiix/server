const {User} = require('../connections/userDB')

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

module.exports = {createUser}