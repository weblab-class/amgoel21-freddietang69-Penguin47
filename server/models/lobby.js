const mongoose = require("mongoose");

const LobbyScheme = new mongoose.Schema({
  name: String,
  creator: String,
  players: [String],
});

module.exports = mongoose.model("lobby", LobbyScheme);
