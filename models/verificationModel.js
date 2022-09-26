const mongoose = require("mongoose");

const veritficationSchema = mongoose.Schema({
  authId: {
    type: String,
    unique: true,
  },
  secretKey: {
    type: String,
    unique: true,
  },
});

module.exports = veritficationSchema;
