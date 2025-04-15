const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Service = require("../models/Service");
const Appointment = require("../models/Appointment");

const { city } = require("./homeRoute");
const { rawListeners } = require("../utils/connection");

router.get("/services/:type", (req, res) => {
  var type = req.params.type;

  if (req.isAuthenticated()) {
    if (req.session.searchCity) {
      console.log("yes", req.session.searchCity);
      User.find({ service: type, city: req.session.searchCity })
        .then((result) => {
          res.render("services", {
            profession: type,
            services: result,
            city: req.session.searchCity,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("not", req.session.searchCity);
      // console.log(req.user)
      User.find({ service: type })
        .then((result) => {
          res.render("services", {
            profession: type,
            services: result,
            city: "1",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/appointment/:providerId", (req, res) => {
  User.findOne({ _id: req.params.providerId }).then((result) => {
    res.render("appointment", {
      providerId: req.params.providerId,
      providerName: result.custname,
    });
  });
});

router.post("/appointment/:providerId", (req, res) => {
  const newAppointment = new Appointment({
    userId: req.user.id,
    providerId: req.params.providerId,
    userName: req.user.custname,
    date: req.body.date,
    time: req.body.time,
    phone: req.user.contact,
    address: req.body.address,
    done: false,
  });

  newAppointment.save();
  res.redirect("/user/appointments");
});

router.get("/done/:id", (req, res) => {
  Appointment.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { done: true } }
  ).then((result) => {
    res.redirect("/home/provider");
  });
});

module.exports = router;
