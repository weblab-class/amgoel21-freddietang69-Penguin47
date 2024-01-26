/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/
const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Lobby = require("./models/lobby");
const Game = require("./models/game");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const user = require("./models/user");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
    if (!req.user) {
        // not logged in
        return res.send({});
    }

    res.send(req.user);
});

router.post("/initsocket", (req, res) => {
    // do nothing if user not logged in
    if (req.user)
        socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
    res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get("/lobbies", (req, res) => {
    Lobby.find({}).then((data) => res.send(data));
});

router.post("/makelobby", (req, res) => {
    console.log(req.body.user);
    console.log("MAKING");
    const lobby = new Lobby({
        name: req.body.name,
        creator: req.body.user._id,
        players: [
            {
                _id: req.body.user._id,
                name: req.body.user.name,
            },
        ],
    });
    Lobby.find({ name: req.body.name }).then((data) => {
        console.log("hello");
        console.log(data);
        if (data.length === 0) {
            console.log("yay");
            lobby.save().then((data) => {
                console.log(data);
            });
            //   game.save();
            socketManager.getIo().emit("lobby", lobby);
            //    res.send({status: "success", lobby: lobby, game: });
        } else {
            //    res.send({status: "success", lobby: lobby});
        }
        // else{
        //  socketManager.getIo().emit("lobby", lobby);
        //}
    });
});

router.post("/makegame", (req, res) => {
    const game = new Game({
        name: req.body.name,
        creator: req.body.user._id,
        players: [
            {
                _id: req.body.user._id,
                name: req.body.user.name,
                deck: [],
                tops: [],
                bottoms: [],
                pile: [],
            },
        ],
        gameState: "waiting",
        deck: [],
    });
    game.save();
    res.send(game._id);
});
sendState = (game) => {
    to_send = {
        players: game.players.map((player) => {
            return {
                name: player.name,
                _id: player._id,
                deck: player.deck.length,
                tops: player.tops,
                bottoms: player.bottoms.length,
            };
        }),
        gameState: game.gameState,
        deck: game.deck.length,
        pile: game.pile,
    };
    let i = 0;
    for (const player of game.players) {
        to_send.player_deck = player.deck;
        to_send.ready = player.ready;
        to_send.player_pos = i;
        i++;
        // console.log(player._id, to_send);
        socketManager.getSocketFromUserID(player._id).emit("update", to_send);
    }
};

startGame = (game) => {
    game.gameState = "playing";
    sendState(game);
};

startSelect = (game) => {
    const deck = [];
    for (const suit of ["hearts", "spades", "clubs", "diamonds"]) {
        for (let value = 3; value <= 13; value++) {
            if (value !== 7 && value !== 10) {
                deck.push({ suit: suit, value: value });
            }
        }
    }
    for (let i = deck.length - 1; i >= 0; i--) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * (i + 1));

        // And swap it with the current element.
        [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
    }
    for (let i = 0; i < game.players.length; i++) {
        for (let j = 0; j < 3; j++) {
            game.players[i].bottoms.push(deck.pop());
        }
    }
    for (const suit of ["hearts", "spades", "clubs", "diamonds"]) {
        for (let value of [2, 7, 10, 14]) {
            deck.push({ suit: suit, value: value });
        }
    }
    for (let i = deck.length - 1; i >= 0; i--) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * (i + 1));

        // And swap it with the current element.
        [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
    }
    for (let i = 0; i < game.players.length; i++) {
        game.players[i].ready = false;
        for (let j = 0; j < 6; j++) {
            game.players[i].deck.push(deck.pop());
        }
    }
    game.deck = deck;
    game.gameState = "selecting";
    sendState(game);
};

router.post("/ready", (req, res) => {
    if (req.user) {
        console.log(req.user._id);
        //const  user=socketManager.getSocketFromUserID(req.body.req.user._id);
        Game.findOne({ _id: req.body.game_id }).then((game) => {
            let found = false;
            for (let i = 0; i < game.players.length; i++) {
                const player = game.players[i];

                if (player._id === req.user._id) {
                    console.log("found");
                    console.log(req.user._id);
                    found = true;
                    if (player.ready) {
                        res.send(true);
                        return;
                    }
                    //only reading in the selecting stage once player has selected all top cards
                    if (game.gameState == "selecting") {
                        if (player.tops.length < 3) {
                            res.send(false);
                            return;
                        }
                    }
                    player.ready = true;
                    game.players[i] = player;
                    console.log(game.players);
                    //     game.save();
                    break;
                }
            }

            if (
                found &&
                game.players.length > 1 &&
                game.players.filter((player) => !player.ready).length == 0
            ) {
                if (game.gameState === "selecting") {
                    startGame(game);
                } else if (game.gameState == "waiting") {
                    startSelect(game);
                }
            }
            game.save();
            res.send(found);
        });
    }
});

router.post("/addgameplayer", (req, res) => {
    Game.findOne({ name: req.body.name }).then(async (game) => {
        // console.log("asdf");
        console.log("Trying to add a player to: ", game._id);

        if (req.body.user) {
            let alreadyInGame = false; // MAKE SURE WE DONT ADD SAME PLAYER MULTIPLE TIMES
            for (player of game.players) alreadyInGame |= player._id == req.body.user._id;
            if (!alreadyInGame) {
                await Game.updateOne(
                    { _id: game._id },
                    {
                        $set: {
                            //  players: [],
                            players: game.players.concat([
                                {
                                    _id: req.body.user._id,
                                    name: req.body.user.name,
                                    deck: [],
                                    tops: [],
                                    bottoms: [],
                                    ready: false,
                                },
                            ]),
                        },
                    }
                );
            }
            res.send(game._id);
        } else {
            console.log("Error: Could not add nonexistent user to game!");
        }
    });
});

router.post("/addlobbyplayer", async (req, res) => {
    //console.log(req.body.lobby);
    //console.log(req.body.userId);
    //dont create lobby if it exists
    // if (!(await Lobby.find({ _id: req.body.lobby._id }))) {
    await Lobby.updateOne(
        { _id: req.body.lobby._id },
        {
            $set: {
                players: req.body.lobby.players.concat([
                    {
                        _id: req.body.user._id,
                        name: req.body.user.name,
                    },
                ]),
            },
        }
    );
    // }
    socketManager.getIo().emit("lobby", "hi");
});

router.get("/user", auth.ensureLoggedIn, (req, res) => {
    //console.log("getting user id", req.query._id);
    User.findOne({ _id: req.query._id }).then((data) => {
        //console.log(data);
        res.send(data);
    });
});
router.post("/selectTop", (req, res) => {
    if (req.user) {
        Game.findOne({ _id: req.body.game_id }).then((game) => {
            //must be in selecting mode
            if (game.gameState !== "selecting") {
                res.send(false);
                return;
            }
            for (let i = 0; i < game.players.length; i++) {
                const player = game.players[i];

                if (player._id === req.user._id) {
                    console.log(req.user._id);
                    //pop selected card and put it in tops
                    if (player.tops.length < 3) {
                        player.tops.push(player.deck[req.body.idx]);
                        player.deck.splice(req.body.idx, 1);
                        game.players[i] = player;
                        console.log(game.players);
                        sendState(game);
                        game.save();
                    }
                    break;
                }
            }
        });
    }
});
redraw = (game) => {
    if (game.deck.length > 0 && game.players[0].deck.length < 3) {
        game.players[0].deck.push(game.deck.pop());
    } else if (game.players[0].deck.length === 0) {
        if (game.players[0].tops.size > 0) {
            game.players[0].deck = game.players[0].tops;
            game.players[0].tops = [];
        } else if (game.players[0].bottoms.size > 0) {
            game.players[0].deck.push(game.players[0].bottoms.pop());
        } else {
            //TODO declare winner
        }
    }
};
router.get("/hi", (req, res) => {
    console.log("hi");
});
router.post("/selectPlay", (req, res) => {
    console.log("WHAT", req.body);
    Game.findOne({ _id: req.body.game_id }).then((game) => {
        //must be in selecting mode
        //TODO implement bombing out of turn
        console.log("try to play");
        if (game.gameState !== "playing" || game.players[0]._id !== req.user._id) {
            res.send(false);
            return;
        }
        console.log("playing");
        //TODO implement bombing on turn
        //TODO implement 2,10,7
        const player = game.players[0];
        if (
            game.pile.length === 0 ||
            (player.deck[req.body.idx].value >= game.pile[game.pile.length - 1].value &&
                game.pile[game.pile.length - 1].value !== 9) ||
            (player.deck[req.body.idx].value < game.pile[game.pile.length - 1].value &&
                game.pile[game.pile.length - 1].value === 9)
        ) {
            //delete card in hand and put it on top of pile
            const card = game.players[0].deck.splice(req.body.idx, 1)[0];
            game.pile.push({ value: card.value, suit: card.suit });
            //draw
            console.log("redraw time");
            redraw(game);
            //TODO implement playing multiple cards logic
            //rotate players
            game.players.push(game.players.shift());
            sendState(game);
            console.log(game.pile);
            game.save();
        }
    });
    res.send({ 1: "selectPlayDone" });
});
router.post("/take", (req, res) => {
    console.log("????");
    Game.findOne({ _id: req.body.game_id }).then((game) => {
        //must be in selecting mode
        //TODO implement bombing out of turn
        // console.log("try to take");
        if (
            game.gameState !== "playing" ||
            game.players[0]._id !== req.user._id ||
            game.pile.length === 0
        ) {
            res.send(false);
            return;
        }
        game.players[0].deck.push(...game.pile);
        game.pile = [];
        //rotate players
        game.players.push(game.players.shift());
        sendState(game);
        // console.log(game.pile);
        game.save();
    });
    res.send({ 1: "bye" });
});
// anything else falls to this "not found" case
router.all("*", (req, res) => {
    console.log(`API route not found: ${req.method} ${req.url}`);
    res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
