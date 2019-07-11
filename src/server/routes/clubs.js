const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Club = require('../models/Club');
const ClubOwner = require('../models/ClubOwner');

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

router.post('/', validateAccessToken, (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: "Club name is required" });

  const clubOwnerId = new mongoose.mongo.ObjectId(res.locals.decoded.id);
  const newClub = new Club({
    owner: clubOwnerId,
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });
  if (req.body.description) newClub.description = req.body.description;

  newClub.save((err) => {
    if (err) {
      if (err.code === 11000) return res.status(400).json({ error: "Club Owner already has a club" });
      return res.status(400).json({ error: err.message });
    }
    ClubOwner.findById(newClub.owner, (err, clubOwner) => {
      if (err) throw err;
      console.log(clubOwner);
      clubOwner.club = newClub._id;
      clubOwner.save((err) => {
        if (err) throw err;
        return res.json({ success: "Club successfully created" });
      });
    });
  });
});

router.put('/', validateAccessToken, (req, res) => {
  console.log(res.locals.decoded);
  let newData = {};
  if (req.body.name) {
    newData.name = req.body.name;
  }
  if (req.body.description) {
    newData.description = req.body.description;
  }
  console.log(newData);
  ClubOwner.findById(new mongoose.Types.ObjectId(res.locals.decoded.id), (err, clubOwner) => {
    if (err) { throw err; }
    if (!clubOwner) return res.status(400).json({ error: "Club Owner not found from token. Your account may have been deleted." });

    Club.updateOne({ _id: clubOwner.club }, newData, (err) => {
      if (err) throw err;
      return res.json({ success: "Club successfully updated" });
    });
  });
});

router.delete('/', validateAccessToken, (req, res) => {
  ClubOwner.findById(new mongoose.Types.ObjectId(res.locals.decoded.id), (err, clubOwner) => {
    if (err) throw err;
    if (!clubOwner) return res.status(400).json({ error: "Club Owner not found from token. Your account may have been deleted." });
    Club.deleteOne({ _id: new mongoose.Types.ObjectId(clubOwner.club) }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Club could not be deleted" });
        console.err(err.stack);
      }
      if (result.deletedCount === 0) return res.status(400).json({ error: "No Club found to be deleted" });
      clubOwner.club = null;
      clubOwner.save((err) => {
        if (err) throw err;
        return res.json({ success: "Club successfully deleted" });
      });
    });
  });
});

router.get('/', (req, res) => {
  res.send("here");
});

router.get('/:id', (req, res) => {
  let clubId;
  try {
    clubId = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res.status(400).json({ error: "Invalid club ID" });
  }
  console.log(clubId)
  Club.findOne({ _id: clubId }, (err, club) => {
    if (err) throw err;
    console.log(club)
    if (!club) {
      return res.status(400).json(
        {
          error: "Club not found with the given ID",
          status: "idNotFound"
        }
      );
    }
    return res.json(club);
  });
});

module.exports = router;
