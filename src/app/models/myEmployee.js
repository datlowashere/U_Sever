const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const myEmployeeSchema = new Schema({
  userId: String, 
  email: String, 
  name: String,
  gender: String,
  image: String,
  role: String,
  phone: String,
  address: String,
});

const myEmployees = mongoose.model("myEmployees", myEmployeeSchema);

module.exports = myEmployees;
