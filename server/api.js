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
const socket = require("socket.io-client/lib/socket");

const gameLogic = require("./game-logic");

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
    // Lobby.find({}).then((data) => res.send(data));
    res.send(
        Object.values(gameLogic.idToGameMap)
            .filter((game) => game.winner === -1)
            .map((game) => {
                return {
                    name: game.name,
                    _id: game._id,
                    players: game.players.map((player) => {
                        return {
                            name: player.name,
                        };
                    }),
                    creator: game.creator,
                };
            })
    );
});

router.post("/makelobby", (req, res) => {
    const id = Object.keys(gameLogic.idToGameMap).length.toString();
    gameLogic.makeGame(req.body.name, id, req.user);
    socketManager.getIo().emit("lobby", "made a lobby");
    res.send({ gameId: id });
    // console.log(req.user);
    // console.log("MAKING");
    // const lobby = new Lobby({
    //     name: req.body.name,
    //     creator: req.user._id,
    //     players: [
    //         {
    //             _id: req.user._id,
    //             name: req.user.name,
    //         },
    //     ],
    // });
    // Lobby.find({ name: req.body.name }).then((data) => {
    //     console.log("hello");
    //     console.log(data);
    //     if (data.length === 0) {
    //         console.log("yay");
    //         lobby.save().then((data) => {
    //             console.log(data);
    //             gameLogic.makeGame(req.body.name, lobby._id);
    //             res.send(lobby._id);
    //         });
    //         //   game.save();
    //         socketManager.getIo().emit("lobby", lobby);
    //         //    res.send({status: "success", lobby: lobby, game: });
    //     } else {
    //         //    res.send({status: "success", lobby: lobby});
    //     }
    //     // else{
    //     //  socketManager.getIo().emit("lobby", lobby);
    //     //}
    // });
});

router.post("/addgameplayer", (req, res) => {
    console.log("Trying to add a player to gameId: ", req.body.gameId);
    if (req.body.gameId in gameLogic.idToGameMap) {
        if (req.user) {
            // console.log("gameId " + gameId);
            socketManager.addPlayerToGame(req.body.gameId, req.user);
            // res.send(gameId);
        } else {
            console.log("Error: Could not add nonexistent user to game!");
        }
    } else {
        res.send("error: gameId does not exist");
    }
});

router.post("/addlobbyplayer", (req, res) => {
    socketManager.getIo().emit("lobby", "hi");
    res.send({ code: "success" });
    //console.log(req.body.lobby);
    //console.log(req.body.userId);
    //dont create lobby if it exists
    // if (!(await Lobby.find({ _id: req.body.lobby._id }))) {
    // Lobby.updateOne(
    //     { _id: req.body.lobby._id },
    //     {
    //         $set: {
    //             players: req.body.lobby.players.concat([
    //                 {
    //                     _id: req.user._id,
    //                     name: req.user.name,
    //                 },
    //             ]),
    //         },
    //     }
    // ).then((data) => {
    //     socketManager.getIo().emit("lobby", "hi");
    //     res.send({ _id: req.body.lobby._id });
    // });
});

router.get("/user", auth.ensureLoggedIn, (req, res) => {
    //console.log("getting user id", req.query._id);
    User.findOne({ _id: req.query._id }).then((data) => {
        //console.log(data);
        res.send(data);
    });
});

router.get("/hi", (req, res) => {
    console.log("hi");
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
    console.log(`API route not found: ${req.method} ${req.url}`);
    res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
