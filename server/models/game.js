const mongoose = require("mongoose");

const GameScheme = new mongoose.Schema({
  name: String,
  creator: String,
  players: [
    {
      _id: String,
      name: String,
      ready: Boolean,
      deck: [
        {
          suit: String,
          value: Number,
        },
      ],
      tops: [
        {
          suit: String,
          value: Number,
        },
      ],
      bottoms: [
        {
          suit: String,
          value: Number,
        },
      ],
    },
  ],
  gameState: String,
  deck: [
    {
      suit: String,
      value: Number,
    },
  ],
  pile: [
    {
      suit: String,
      value: Number,
    },
  ],
});

module.exports = mongoose.model("game", GameScheme);
