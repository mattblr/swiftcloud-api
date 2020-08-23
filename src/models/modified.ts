export {};

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const modifiedSchema = new Schema({
  modifiedDate: {
    type: Date,
    required: true,
  },
  executionDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Modified", modifiedSchema);
