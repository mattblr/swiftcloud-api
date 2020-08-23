export {};

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listenSchema = new Schema({
  song: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  writer: [
    {
      type: String,
      required: true,
    },
  ],
  album: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  plays: [
    {
      date: {
        type: String,
        required: true,
      },
      plays: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Listen", listenSchema);
