const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()


app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb+srv://alex:' + "n4K5ZPo1LXpql1fl" + '@api-shop-b9ere.mongodb.net/userDB', {
    useNewUrlParser: true
});

const userSchema = {
    email: String,
    password: String
}

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    })
    newUser.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
        }
    })
})



module.exports = app;