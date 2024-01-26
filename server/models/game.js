const mongoose = require("mongoose");

const GameScheme = new mongoose.Schema({
    name: String,
    creator: String,
    players: [
        {
            _id: String,
            name: String,
            ready: { type: Boolean, default: false },
            deck: {
                type: [
                    {
                        suit: String,
                        value: Number,
                    },
                ],
                default: [],
            },
            tops: {
                type: [
                    {
                        suit: String,
                        value: Number,
                    },
                ],
                default: [],
            },
            bottoms: {
                type: [
                    {
                        suit: String,
                        value: Number,
                    },
                ],
                default: [],
            },
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
