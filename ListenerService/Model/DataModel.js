const mongoose = require("mongoose");

const DataElementSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  origin: {
    type: String,
  },
  destination: {
    type: String,
  },
  secretKey: {
    type: String,
  },
});

const DataTimeSeriesSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  Data: [DataElementSchema],
});

DataTimeSeriesSchema.index({ timestamp: 1 });

const DataModel = mongoose.model("stream-data", DataTimeSeriesSchema);

module.exports = { DataModel };
