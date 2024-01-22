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
  // const game = new Game({
  //   name: req.body.name,
  //   creator: req.body.user._id,
  //   players: [
  //     {
  //       _id: req.body.user._id,
  //       name: req.body.user.name,
  //       deck: [],
  //       tops: [],
  //       bottoms: [],
  //     },
  //   ],
  //   gameState: "waiting",
  //   deck: [],
  // });
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
      },
    ],
    gameState: "waiting",
    deck: [],
  });
  game.save();
  res.send(game._id);
});
startGame = (game) => {
  const deck = [];
  for (const suit of ["hearts", "spades", "clubs", "diamonds"]) {
    for (let value = 2; value <= 14; value++) {
      deck.push({ suit: suit, value: value });
    }
  }
  for (let i = 51; i >= 0; i--) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * (i + 1));

    // And swap it with the current element.
    [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
  }
  game.deck = deck;
  game.gameState = "playing";
  // game.save();
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
        startGame(game);
      }
      game.save();
      res.send(found);
    });
  }
});
router.post("/addgameplayer", (req, res) => {
  //  Game.findOne({ name: req.body.name }).then((game) => {
  //   game.players=game.players.concat([
  //           {
  //             _id: req.body.user._id,
  //             name: req.body.user.name,
  //             deck: [],
  //             tops: [],
  //             bottoms: [],
  //           },
  //         ]),
  //       };
  //     }
  //   );

  //   res.send(game._id);
  // });
  Game.findOne({ name: req.body.name }).then(async (game) => {
    console.log("asdf");
    console.log(game._id);
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

    res.send(game._id);
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

router.get("/user", (req, res) => {
  //console.log("getting user id", req.query._id);
  User.findOne({ _id: req.query._id }).then((data) => {
    //console.log(data);
    res.send(data);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
