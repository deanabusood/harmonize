const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  external_urls: {
    spotify: {
      type: String,
      required: true,
    },
  },
  artists: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [songSchema],
});

//hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
