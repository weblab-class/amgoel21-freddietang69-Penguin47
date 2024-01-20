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

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

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
  const lobby = new Lobby({
    name: req.body.name,
    creator: req.body.userId,
    players: [req.body.userId],
  });
  lobby.save().then((data) => {
    console.log(data);
  });
  socketManager.getIo().emit("lobby", lobby);
});

router.post("/addlobbyplayer", (req, res) => {
  //console.log(req.body.lobby);
  //console.log(req.body.userId);
  async function foo() {
    await Lobby.updateOne(
      { _id: req.body.lobby._id },
      {
        $set: { players: req.body.lobby.players.concat([req.body.userId]) },
      }
    );
  }
  foo();
  socketManager.getIo().emit("lobby", "hi");
});

router.get("/getname", (req, res) => {
  User.find({ _id: req.query._id }).then((data) => res.send(data.name));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
