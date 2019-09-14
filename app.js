require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

//bodyparser
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//use session
app.use(session({
  secret: "this is massive secret",
  resave: false,
  saveUninitialized: false,
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  process.env.DBUSER + process.env.DBPW + "@api-shop-b9ere.mongodb.net/userDB", {
    useNewUrlParser: true
  }
);
mongoose.set("useCreateIndex", true)

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets")
  } else {
    res.redirect("/login")
  }
})

app.get("/register", (req, res) => {
  res.render("register");
});



app.post("/register", (req, res) => {

  User.register({
    username: req.body.username
  }, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      res.redirect("/register")
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets")
      })

    }
  })
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, err => {
    if (err) {
      console.log(err)
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets")
      })
    }
  })
});

module.exports = app;