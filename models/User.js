const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../utils/connection");

const UserSchema = new Schema({
  username: String,
  hash: String,
  salt: String,
  password: String,
  custname: String,
  contact: String,
  providerName: String,
  city: String,
  searchCity: String,
  service: String,
  rating: Number,
  experience: String,
  isCustomer: Boolean,
  isProvider: Boolean,
  providerImage: String,
  speciality1: String,
  speciality2: String,
});

const User = connection.model("User", UserSchema);

module.exports = User;
