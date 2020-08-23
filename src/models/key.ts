export {};

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const keySchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Key", keySchema);
