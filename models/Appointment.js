const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../utils/connection');

const appointmentSchema = new Schema({
    userId: String,
    providerId: String,
    userName: String,
    date: String,
    time: String,
    phone: String,
    address: String,
    done: Boolean,
});

const Appointment = connection.model('Appointment', appointmentSchema);


module.exports = Appointment;