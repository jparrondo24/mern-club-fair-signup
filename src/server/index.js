const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.static('dist'));

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("Successfully connected to MongoDB database");
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
