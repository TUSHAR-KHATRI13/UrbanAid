const express = require("express");
const homeRouter = express.Router();

const User = require("../models/User");
const Service = require("../models/Service");
const Appointment = require("../models/Appointment");

var city = "";
var providers = [];

homeRouter.post("/", (req, res) => {
  req.session.searchCity = "";
  if (req.isAuthenticated()) {
    req.session.searchCity = req.body.city;
    res.redirect("/services/Electrician");
  } else {
    res.redirect("/login");
  }

  // User.find({city: city}).then((result) => {
  //     res.render("services", {services: result})
  // })
  // .catch((err) => {
  //     console.log(err);
  // })

  // res.redirect("/")
});

homeRouter.get("/provider/service", (req, res) => {
  res.render("provider");
});

homeRouter.post("/provider/service", (req, res) => {
  var userId = req.user.id;
  console.log(userId);

  User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        profession: req.body.profession,
        city: req.body.city,
        experience: req.body.experience,
      },
    }
  ).then((result) => {
    res.redirect("/home/provider");
  });
  // const newService = new Service({
  //     providerName: req.body.providerName,
  //     profession: req.body.profession,
  //     city: req.body.city,
  //     experience: req.body.experience
  // })

  // newService.save()
  // res.redirect("/")
});

homeRouter.post("/provider/login", (req, res) => {});

homeRouter.get("/", (req, res) => {
  // console.log(req.user.id)
  if (req.isAuthenticated()) {
    res.render("home", { loggedIn: true });
  } else {
    res.render("home", { loggedIn: false });
  }
});

homeRouter.get("/home/provider", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    Appointment.find({ providerId: req.user.id, done: false }).then(
      (appointments) => {
        // console.log(result)
        User.findOne({ _id: req.user.id }).then((user) => {
          res.render("providerHome", {
            appointments: appointments,
            user: user,
          });
        });
      }
    );
  } else {
    res.redirect("/");
  }
});

homeRouter.get("/user/appointments", async (req, res) => {
  var result = await Appointment.find({ userId: req.user.id });

  for (const item of result) {
    var user = await User.findOne({ _id: item.providerId });
    providers.push(user);
  }
  console.log(result);
  res.render("userAppointment", { result: result, providers: providers });

  // if(result.length > 0){
  //     var i = 0;
  // User.findOne({_id: result[i].providerId}).then((user) =>{
  //     console.log(user)
  //     res.render("userAppointment", { result: result, name: user.custname, contact: user.contact})
  // })}
  // else{
  //     res.render("userAppointment", {result: []})
  // }

  // .catch((err) => {

  // })
});

homeRouter.get("/users", (req, res) => {
  User.find({}).then((user) => {
    res.send(`${user[0].username}`);
  });
});

module.exports = { city, homeRouter };
