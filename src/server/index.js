const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const clubowners = require('./routes/clubowners');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('dist'));
app.use(cookieParser());

app.use("/clubowners", clubowners);

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("Successfully connected to MongoDB database");
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
