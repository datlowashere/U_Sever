const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  phone: String,
  address: String,
  img:String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
