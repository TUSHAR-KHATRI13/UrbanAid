const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const multer = require("multer");
const passport = require("passport");
const User = require("../models/User");
const Service = require("../models/Service");
const path = require("path");
const { json } = require("express");

var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
}).single("providerImage");

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("loginUser");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  req.logout();
  res.redirect("/");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user.isProvider === true) {
      res.redirect("/home/provider");
    }
    if (req.user.isCustomer === true) {
      res.redirect("/");
    }
  }
);

router.post("/register", upload, (req, res) => {
  var type = req.body.type;

  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  var specialities = req.body.speciality.split(",");
  var newUser = {};
  if (type === "customer") {
    newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt,
      custname: req.body.custname,
      contact: req.body.contact,
      isCustomer: true,
    });
  } else {
    newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt,
      custname: req.body.custname,
      contact: req.body.contact,
      service: req.body.service,
      city: req.body.city,
      experience: req.body.experience,
      isProvider: true,
      providerImage: req.file.filename,
      speciality1: specialities[0],
      speciality2: specialities[1],
    });
  }

  newUser
    .save()
    .then((result) => {
      console.log("..");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/login");
  // }

  // else{
  //     const newProvider = new Service({
  //         username: req.body.username,
  //         hash: hash,
  //         salt: salt,
  //     })

  //     newProvider.save().then((result) => {
  //         res.redirect("/home/provider")
  //     }).catch((err) => {
  //         console.log(err)
  //     })
  // }
});

router.get("/check", (req, res) => {
  var api_key = "1dcb92821cd2ecb686be805adf2019a6-20ebde82-0cebb47a";
  var domain = "sandbox76d5d709b4db4846a9d60539638246ec.mailgun.org";
  var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

  var val = Math.floor(1000 + Math.random() * 9000);
  var data = {
    from: "doorTodoor@noreply.ru",
    to: "akashkhatri1001@gmail.com",
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: `<p>${val}</p>`,
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    if (error) {
      console.log(error);
    } else {
      res.status(200).json({ msg: "ok" });
    }
  });
});

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

module.exports = router;
