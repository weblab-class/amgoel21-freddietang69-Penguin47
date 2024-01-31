const mongoose = require("mongoose");

const MessageScheme = new mongoose.Schema({
  creator: String,
  content: String,
});

module.exports = mongoose.model("message", MessageScheme);
