const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  favoriteColor: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  skillLevel: {
    type: Number,
    required: true,
  },
});

const userInfo = mongoose.model("userInfo", userSchema);

export {};
module.exports = userInfo;
