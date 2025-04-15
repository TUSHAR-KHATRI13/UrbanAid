require('dotenv').config()
const mongoose = require('mongoose');


const conn = process.env.DB_STRING;
const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = connection;