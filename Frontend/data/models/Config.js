const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: String,
    ICP: String,
    copyright: String,
    bottomText: String,
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { versionKey: false },
);

module.exports = mongoose.model("Config", schema);
