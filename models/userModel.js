const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = mongoose.connection;
// const autoIncrement = require('mongoose-auto-increment')
// autoIncrement.initialize(connection);
const bcrypt = require("bcrypt");


// const pointSchema = new Schema({
//   type: {
//     type: String,
//     enum: ["Point"],
//     required: true,
//   },
//   coordinates: {
//     type: [Number],
//     required: true,
//   },
// });

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  verified: { type: Boolean, default: false },
  image: { type: String },
  createdAt: { type: Date },
  genre: [{type: String, enum: ['pop', 'rock', 'hip hop', 'latin', 'edm', 'r&b', 'country', 'folk', 'classical', 'jazz', 'metal', 'easy listening', 'new age', 'blues', 'world', 'electronic', 'techno', 'house']}],
  instrument: {type: String, enum: ['guitar', 'piano', 'drums', 'percussion', 'bass', 'synths', 'vocals', 'violin', 'saxophone', 'cello', 'double bass', 'clarinet', 'trumpet', 'flute', 'harp']},
  liked_songs: [],
  location: {}
  // ipInfo: {
  //   ip: { type: String, default: "" },
  //   range: { type: Array, default: [] },
  //   country: { type: String, default: "" },
  //   region: { type: String, default: "" },
  //   eu: { type: String, default: "" },
  //   city: { type: String, default: "" },
  //   ll: { type: Array },
  //   metro: Number,
  //   area: Number,
  // },
  // lastLocation: {
  //   type: pointSchema,
  //   default: {
  //     type: "Point",
  //     coordinates: [0, 0],
  //   },
  //   index: "2dsphere",
  // }
})
;

userSchema.pre("save", async function (next) {
  try {
    if(this.password) {  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// userSchema.plugin(autoIncrement.plugin, {
//   startAt: 1,
//   incrementBy: 1,
//   model: "User",
// });

const User = mongoose.model('User', userSchema)

module.exports = User;
