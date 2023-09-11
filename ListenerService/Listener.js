const express = require("express");
const app = express();
const io = require("socket.io-client");
const DecryptAndSaveFunc = require("./DecodeData");
require("dotenv").config();
const mongoose = require("mongoose");

const MongoDBString = process.env.MONGODB_CONNECTION_STRING;
mongoose
  .connect(MongoDBString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });

const secretKey = process.env.PASS_KEY;
console.log(secretKey);

const port = process.env.LISTENER_PORT || 5000;

const emitterServiceURL = process.env.EMITTER_PORT;

const Socket = io(emitterServiceURL);

let EncryptedData;
let DecryptedData;

Socket.on("connect", () => {
  console.log("Connected to emitter service");

  Socket.on("EncryptedString", (hashValue) => {
    console.log("Received hashValue from emitter:", hashValue);
    EncryptedData = hashValue;
    DecryptAndSaveFunc(EncryptedData, secretKey);
  });
});

Socket.on("disconnect", () => {
  console.log("Disconnected from emitter service");
});

app.listen(port, () => {
  console.log(`Listener service is listening on port ${port}`);
});

module.exports = EncryptedData;
