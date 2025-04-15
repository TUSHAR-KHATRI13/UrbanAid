require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const MongoStore = require('connect-mongo');


const User = require('./models/User')


const { homeRouter } = require('./routes/homeRoute')
const serviceRoutes = require('./routes/services')
const authenticationRoutes = require('./routes/authentication')

const app = express()


var storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req,file,cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname) )
    }
})

var upload = multer({
    storage: storage
}).single('provideImage');


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));



passport.use(new LocalStrategy(
    function(username, password, cb) {
        console.log(username)
        User.findOne({ username: username })
            .then((user) => {

                if (!user) { return cb(null, false) }
                
                const isValid = validPassword(password, user.hash, user.salt);

                console.log(isValid)
                
                if (isValid) {
                    return cb(null, user);
                } else {
                    return cb(null, false);
                }
            })
            .catch((err) => {   
                cb(err);
            });
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(homeRouter)
app.use(serviceRoutes)
app.use(authenticationRoutes)


function validPassword(password, hash, salt) {

    // console.log(password, salt)
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

app.listen(3000, (req, res) => {
    console.log('connected')
})


