const User = require('../models/userModel')
const Music = require('../models/musicModel')
const fs = require('fs');
const path = require('path')
const bcrypt = require('bcrypt');

const createUser = (req, res) => {
    const newUser = req.body;
                User.create({...newUser, verified: true}).then(() => {
                    // create a folder named "email" inside the uploads folder in private case
                    fs.mkdir(path.join(__dirname, '../uploads/' + newUser.email), (err) => {
                        if(err) {
                            res.json(err)
                        }
                        else {
                            res.json('done')
                        }
                    })
                

                    // in public case: store the file inside the folder "music"
                    
                })
            
}

const login = (req, res) => {
    let user = req.body;
    User.findOne({email: user.email})
        .then(result => {
            if(result !== null){
                console.log(result)
                if(result.verified === true) {
                    bcrypt.compare(user.password, result.password, (err, data) => {
                        if(err) {
                            res.json(err)
                        } 
                        else{
                            req.session.user = result;
                            res.json(result)
                        }
                    })
                }
                else {
                    res.json('user not verified')
                }
            }else {
                res.json('error, user doesn"t exist')
            }
        })
}




module.exports = {createUser, login}