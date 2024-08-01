require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require("./config/db");
const router = require("./router/userRouter")
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;



const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true,
    // cookie: {secure: true}
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);


passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:2112/api/v1/google/callback"
  },
  function(req, accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user)}
);

passport.deserializeUser((user, done) => {
    done(null, user)}
);

app.listen(port, () => {
    console.log(`Server is running on ${port}.`)
});
