//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["passwrod"] });

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=> {
  res.render("home");
});

app.get("/register", (req, res)=> {
  res.render("register");
});

app.get("/login", (req, res)=> {
  res.render("login");
});

app.post("/register", (req, res)=> {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save((err)=> {
    if(!err) {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res)=> {
  User.findOne({email: req.body.username}, (err, foundEmail)=> {
    if(!err) {
      if(foundEmail.password === req.body.password) {
        res.render("secrets");
      } else {
        console.log("Password not matched...");
      }
    }
  });
});

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

 app.listen(port, ()=> {
   console.log("Server started at port " + port);
 });
