const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    minlength: [3, "username must be at least 3 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    match: [/.+\@.+\..+/, "Please use a valid email address"],
    unique: [true, "account already exists"],
    trim: true,
  },
  password: {
    type: String,
    minlength: [6, "password must be at least 6 characters"],
  },
  verified: { type: Boolean, default: false },
  image: { type: String },
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
  instrument: {
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
  },
  liked_songs: [],
});
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
