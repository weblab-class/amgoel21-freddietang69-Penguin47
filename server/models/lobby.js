const mongoose = require("mongoose");

const LobbyScheme = new mongoose.Schema({
  name: String,
  creator: String,
  players: [
    {
      _id: String,
      name: String,
    },
  ],
});

module.exports = mongoose.model("lobby", LobbyScheme);
