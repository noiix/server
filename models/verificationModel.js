const mongoose = require("mongoose");

const verificationSchema = mongoose.Schema({
  authId: {
    type: String,
    unique: true,
  },
  secretKey: {
    type: String,
    unique: true,
  },
});


const Verification = mongoose.model('Verification', verificationSchema)

module.exports = Verification;
