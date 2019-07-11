const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require('dotenv').config();

const ClubOwner = require('../models/ClubOwner');

const validateRegisterFields = (req, res, next) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!req.body.name || req.body.name === '') {
    return res.status(400).json({ error: "Name is required" });
  } else if (!req.body.email || !emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: "Invalid email" });
  } else if (!req.body.password || !passwordRegex.test(req.body.password)) {
    return res.status(400).json({ error: "Password must be at least 8 characters, with at least one letter and one number" });
  } else {
    next();
  }
};

router.post("/register", validateRegisterFields, (req, res) => {
  // Create ClubOWner Object
  let newClubOwner = new ClubOwner({
    _id: new mongoose.Types.ObjectId(),
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
          return res.status(403).json({ error: message });
        }
        // Create a JSON Web Token storing the id of the new ClubOwner document
        jwt.sign({"id": newClubOwner._id }, process.env.SECRET, (err, token) => {
          if (err) { throw err; }
          res.cookie('clubownerAccessJwt', token, { httpOnly: true });
          return res.json({ success: "Token set in clubOwnerAccessJwt cookie" });
        });
      });
    });
  });
});

const validateLoginFields = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ error: "Email is required" });
  } else if (!req.body.password) {
    return res.status(400).json({ eror: "Password is required" });
  } else {
    next();
  }
}

router.post('/login', validateLoginFields, (req, res) => {
  // Check if a ClubOwner with the email exists
  ClubOwner.findOne({ email: req.body.email }, (err, clubOwner) => {
    if (err) { return res.status(403).json({ error: "Email and/or password incorrect "}); }
    if (!clubOwner) { return res.status(403).json({ error: "Email and/or password incorrect "}); }
    // If it does, check the password
    bcrypt.compare(req.body.password, clubOwner.password, (err, result) => {
      if (!result) { return res.status(403).json({ error: "Email and/or password incorrect "}); }

      // If the password is correct, respond with the token
      jwt.sign({"id": clubOwner._id }, process.env.SECRET, (err, token) => {
        if (err) { throw err; }

        res.cookie('clubownerAccessJwt', token, { httpOnly: true });
        return res.json({ success: "Token set in clubOwnerAccessJwt cookie" });
      });
    });
  });
});

const validateAccessToken = (req, res, next) => {
  const token = req.cookies.clubownerAccessJwt;
  if (!token) {
    return res.status(403).json({
      error: "You are not signed in!",
      status: "tokenMissing"
    });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({
          error: "Your session has expired. Please sign in again to restore it",
          status: "tokenExpired"
        });
      }
    }
    res.locals.decoded = decoded;
  });
  next();
}

router.get('/', validateAccessToken, (req, res) => {
  ClubOwner.findById(res.locals.decoded.id, (err, clubOwner) => {
    if (err) { throw err };
    if (!clubOwner) {
      res.clearCookie('clubownerAccessJwt', { httpOnly: true });
      return res.status(403).json({ error: "Your account is no longer found, it may have been deleted" });
    }
    const clubOwnerData = {
      name: clubOwner.name,
      email: clubOwner.email,
      students: clubOwner.students
    }
    console.log(clubOwner);
    if (clubOwner.club) clubOwnerData.club = clubOwner.club;
    return res.json(clubOwnerData);
  });
});


const validateUpdateFields = (req, res, next) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (req.body.email) {
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
  }
  if (req.body.newPassword) {
    if (!req.body.oldPassword) {
      return res.status(400).json({ error: "Old password is required"});
    }
    if (!passwordRegex.test(req.body.newPassword)) {
      return res.status(400).json({ error: "New password must be at least 8 characters, with at least one letter and one number" });
    }
  }
  next();
}

router.put('/', [validateAccessToken, validateUpdateFields], (req, res) => {
  const newData = {};
  if (req.body.name) {
    newData.name = req.body.name
  }
  if (req.body.email) {
    newData.email = req.body.email
  }
  if (req.body.newPassword) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newPassword, salt);
    console.log(hash);
    newData.password = hash;
  }
  ClubOwner.findById(res.locals.decoded.id, (err, clubOwner) => {
    if (err) { throw err; }
    if (req.body.oldPassword) {
      bcrypt.compare(req.body.oldPassword, clubOwner.password, (err, result) => {
        if (!result) { return res.status(403).json({ error: "Old password is incorrect "}); }
        ClubOwner.updateOne({ _id: res.locals.decoded.id }, newData, (err) => {
          if (err) { throw err; }
          return res.json({ success: "Successfully updated your Club Owner account" });
        });
      });
    } else {
      ClubOwner.updateOne({ _id: res.locals.decoded.id }, newData, (err) => {
        if (err) { throw err; }
        return res.json({ success: "Successfully updated your Club Owner account" });
      });
    }
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('clubownerAccessJwt', { httpOnly: true });
  res.json({ success: "Succesfully logged out" });
});

router.delete('/', validateAccessToken, (req, res) => {
  ClubOwner.deleteOne({ _id: res.locals.decoded.id }, (err) => {
    if (err) { return res.status(500).json({ error: "Club Owner account could not be deleted "})}
    res.clearCookie('clubownerAccessJwt', { httpOnly: true });
    return res.json({ success: "Club Owner successfully deleted "});
  });
});

module.exports = router;
