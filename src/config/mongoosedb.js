const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/user_management");
    console.log("Connected!");
  } catch (error) {
    console.log("FAILLED!" + error);
  }
}

module.exports = { connect };
