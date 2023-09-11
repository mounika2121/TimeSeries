const express = require("express");
const { Socket } = require("socket.io");
const app = express();
require("dotenv").config();

const port = process.env.EMITTER_PORT;

const http = require("http").Server(app);

const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  socket.emit("server1", "message from server1");
});

setInterval(() => {
  const hashValue = require("./RandomString");
  console.log(hashValue);
  io.emit("EncryptedString", hashValue());
}, 10000);

http.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
