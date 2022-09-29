const mongoose = require("mongoose");

// user db connection

const userDB = mongoose.connect(process.env.DB_LINK_USER, (err) => {
    if (err) throw err
    console.log('user db is connected');
})


module.exports = {userDB};
