const gameLogic = require("./game-logic");
const game = require("./models/game");

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const sendGameState = (gameId) => {
    let game = gameLogic.idToGameMap[gameId];
    to_send = {
        players: game.players.map((player) => {
            return {
                name: player.name,
                _id: player._id,
                deck: player.deck.length,
                tops: player.tops,
                bottoms: player.bottoms.length,
                revealed: player.deck.filter((card) => card.revealed),
            };
        }),
        turn: game.turn,
        gameState: game.gameState,
        deck: game.deck.length,
        pile: game.pile,
    };
    let i = 0;
    for (const player of game.players) {
        to_send.player_deck = player.deck;
        to_send.readySelect = player.readyToSelect;
        to_send.readyPlay = player.readyToPlay;
        to_send.player_pos = i;
        i++;
        // console.log(player._id, to_send);
        getSocketFromUserID(player._id).emit("update", to_send);
    }
    // io.emit("update", gameLogic.nameToGameMap[gameId]);
};

const addPlayerToGame = (gameId, user) => {
    gameLogic.addPlayerToGame(gameId, user);
    sendGameState(gameId);
};

const readyUpSelect = (gameId, user) => {
    gameLogic.readyUpSelect(gameId, user);
    sendGameState(gameId);
};

const readyUpPlay = (gameId, user) => {
    gameLogic.readyUpPlay(gameId, user);
    sendGameState(gameId);
};

const selectTop = (gameId, user, selected) => {
    for (let i = 5; i >= 0; --i) {
        if (selected[i]) {
            gameLogic.selectTop(gameId, user, i);
        }
    }
    sendGameState(gameId);
};
const pass = (gameId, user, idx) => {
    gameLogic.pass(gameId, user, idx);
    sendGameState(gameId);
};
const steal = (gameId, user, idx, victim) => {
    const vict = gameLogic.steal(gameId, user, idx, victim);
    sendGameState(gameId);

    if (vict !== -1) {
        const game = gameLogic.idToGameMap[gameId];
        getSocketFromUserID(game.players[vict]._id).emit("block", { stealer: game.turn });
    }
};
const block = (gameId, user, response) => {
    gameLogic.block(gameId, user, response);
    sendGameState(gameId);
};
const selectPlay = (gameId, user, idx) => {
    console.log("selectPlay");
    console.log(gameId);
    console.log(user);
    console.log(idx);
    gameLogic.selectPlay(gameId, user, idx);
    sendGameState(gameId);
};

const take = (gameId, user) => {
    gameLogic.take(gameId, user);
    sendGameState(gameId);
};

const addUser = (user, socket) => {
    const oldSocket = userToSocketMap[user._id];
    if (oldSocket && oldSocket.id !== socket.id) {
        // there was an old tab open for this user, force it to disconnect
        // FIXME: is this the behavior you want?
        oldSocket.disconnect();
        delete socketToUserMap[oldSocket.id];
    }

    userToSocketMap[user._id] = socket;
    socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
    if (user) delete userToSocketMap[user._id];
    delete socketToUserMap[socket.id];
};

module.exports = {
    init: (http) => {
        io = require("socket.io")(http);

        io.on("connection", (socket) => {
            console.log(`socket has connected ${socket.id}`);
            socket.on("disconnect", (reason) => {
                const user = getUserFromSocketID(socket.id);
                console.log("disconnect");
                removeUser(user, socket);
            });

            socket.on("readySelect", (gameId) => {
                const user = getUserFromSocketID(socket.id);
                if (user) readyUpSelect(gameId, user);
            });
            socket.on("readyPlay", (gameId) => {
                const user = getUserFromSocketID(socket.id);
                if (user) readyUpPlay(gameId, user);
            });
            socket.on("selectTop", (data) => {
                const user = getUserFromSocketID(socket.id);
                if (user) selectTop(data.gameId, user, data.selected);
            });
            socket.on("selectPlay", (data) => {
                const user = getUserFromSocketID(socket.id);
                if (user) selectPlay(data.gameId, user, data.idx);
            });
            socket.on("pass", (data) => {
                const user = getUserFromSocketID(socket.id);
                console.log("pass");
                if (user) pass(data.gameId, user, data.idx);
            });
            socket.on("take", (gameId) => {
                const user = getUserFromSocketID(socket.id);
                if (user) take(gameId, user);
            });
            socket.on("steal", (data) => {
                const user = getUserFromSocketID(socket.id);
                if (user) steal(data.gameId, user, data.idx, data.victim);
            });
            socket.on("block", (data) => {
                const user = getUserFromSocketID(socket.id);
                if (user) block(data.gameId, user, data.response);
            });
        });
    },

    addUser: addUser,
    removeUser: removeUser,

    getSocketFromUserID: getSocketFromUserID,
    getUserFromSocketID: getUserFromSocketID,
    getSocketFromSocketID: getSocketFromSocketID,
    addPlayerToGame: addPlayerToGame,
    sendGameState: sendGameState,
    getIo: () => io,
};
