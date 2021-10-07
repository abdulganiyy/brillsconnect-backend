const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  phone: String,
  emailCode: String,
  isVerified: String,
  password: String,
  avatar: String,
  interest: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
