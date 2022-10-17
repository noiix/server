const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = mongoose.connection;
const bcrypt = require("bcrypt");


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
  image: { type: String, default: "https://res.cloudinary.com/noix/image/upload/v1665502236/images/defaultProfile_ppkokd.png" },
  createdAt: { type: Date },
  genre: [
    {
      type: String,
      enum: [
        "pop",
        "rock",
        "hip hop",
        "latin",
        "edm",
        "r&b",
        "country",
        "folk",
        "classical",
        "jazz",
        "metal",
        "easy listening",
        "new age",
        "blues",
        "world",
        "electronic",
        "techno",
        "house",
      ],
    },
  ],
  instrument: [{
    type: String,
    enum: [
      "guitar",
      "piano",
      "drums",
      "percussion",
      "bass",
      "synths",
      "vocals",
      "violin",
      "saxophone",
      "cello",
      "double bass",
      "clarinet",
      "trumpet",
      "flute",
      "harp",
    ],
  }],
  liked_songs: [{type: Schema.Types.ObjectId,
    ref: 'Music'}],
  intro_text: {type: String},
  location: {},
  music: [{type: Schema.Types.ObjectId,
    ref: 'Music'}],
  contacts: [{type: Schema.Types.ObjectId,
    ref: 'User'}]
});

userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});


const User = mongoose.model("User", userSchema);

module.exports = User;
