const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const ClubOwner = require('../models/ClubOwner');

const validateRegisterFields = (req, res, next) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!req.body.name || req.body.name === '') {
    return res.status(403).json({ error: "Name is required" });
  } else if (!req.body.email || !emailRegex.test(req.body.email)) {
    return res.status(403).json({ error: "Invalid email" });
  } else if (!req.body.password || !passwordRegex.test(req.body.password)) {
    return res.status(403).json({ error: "Password must be at least 8 characters, with at least one letter and one number" });
  } else {
    next();
  }
};

router.post("/register", validateRegisterFields, (req, res) => {

  // Create ClubOWner Object
  let newClubOwner = new ClubOwner({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  // Use bcrypt to create a hashed password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newClubOwner.password, salt, (err, hash) => {
      newClubOwner.password = hash;
      // Try and save the mongoose object
      newClubOwner.save((err, newClubOwner) => {
        if (err) {
          let { message } = err;
          if (err.code === 11000) {
            message = "This email is already registered!";
          }
          return res.status(400).json({ error: message }); }
        // Create a JSON Web Token storing the id of the new ClubOwner document
        jwt.sign({"id": newClubOwner._id }, process.env.SECRET, (err, token) => {
          if (err) { throw err; }
          return res.json({
            token: token
          });
        });
      });
    });
  });
});

router.post('/login', (req, res) => {
  // Check if a ClubOwner with the email exists
  ClubOwner.findOne({ email: req.body.email }, (err, clubOwner) => {
    if (err) { return res.status(403).json({ error: "Email and/or password incorrect "}); }
    if (!clubOwner) { return res.status(403).json({ error: "Email and/or password incorrect "}); }
    // If it does, check the password
    bcrypt.compare(req.body.password, clubOwner.password, (err) => {
      if (err) { return res.status(403).json({ error: "Email and/or password incorrect "}); }

      // If the password is correct, respond with the token
      jwt.sign({"id": clubOwner._id }, process.env.SECRET, (err, token) => {
        if (err) { throw err; }

        return res.json({
          token: token
        });
      });
    });
  });
});

module.exports = router;
