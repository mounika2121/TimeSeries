const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const TimeseriesModel = require("../ListenerService/Model/DataModel");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

mongoose
  .connect("mongodb://localhost:27017/timeSeries", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });

io.on("connection", (socket) => {
  console.log("Client connected");
  TimeseriesModel.DataModel.find({}, (err, documents) => {
    if (err) {
      console.error(err);
      return;
    }
    socket.emit("initialDocuments", documents);
  });

  const changeStream = TimeseriesModel.DataModel.watch();
  changeStream.on("change", (change) => {
    if (
      change.operationType === "insert" ||
      change.operationType === "update"
    ) {
      const updatedDocument = change.fullDocument;
      socket.emit("updatedDocument", updatedDocument);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
