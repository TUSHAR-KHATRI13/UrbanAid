const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../utils/connection');

const serviceSchema = new Schema({
    providerName: String,
    password: String,
    city: String,
    profession: String,
    rating: Number,
    experience: String,
    specialities: [String]
});

const Service = connection.model('Service', serviceSchema);


module.exports = Service;