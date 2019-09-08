require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

mongoose.connect(
    process.env.DBUSER +
    process.env.DBPW +
    "@api-shop-b9ere.mongodb.net/userDB", {
        useNewUrlParser: true
    }
);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(err => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({
        email: username
    }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        }
    });
});

module.exports = app;