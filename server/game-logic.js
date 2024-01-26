/** constants */

/** Utils! */

/** Helper to generate a random integer */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

idToGameMap = {};

const makeGame = (name, creator = "billy bob joe") => {
    //console.log(Object.keys(idToGameMap).length);
    game = {
        name: name,
        _id: Object.keys(idToGameMap).length,
        creator: creator,
        players: [],
        gameState: "waiting",
        deck: [],
        pile: [],
    };
    idToGameMap[game._id] = game;
};

makeGame("test");

const addPlayerToGame = (gameId, user) => {
    game = idToGameMap[gameId];
    let alreadyInGame = false; // MAKE SURE WE DONT ADD SAME PLAYER MULTIPLE TIMES
    for (player of game.players) alreadyInGame |= player._id == user._id;
    if (!alreadyInGame) {
        game.players.push({
            _id: user._id,
            name: user.name,
            deck: [],
            tops: [],
            bottoms: [],
            readyToSelect: false,
            readyToPlay: false,
        });
    }
};

const readyUpSelect = (gameId, user) => {
    console.log(user._id);
    const game = idToGameMap[gameId];

    let found = false;
    for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        //console.log(player);
        //console.log(user._id);
        if (player._id === user._id) {
            console.log("found " + user._id);
            found = true;
            if (player.readyToSelect) return true;
            player.readyToSelect = true;
            break;
        }
    }

    if (
        found &&
        game.players.length > 1 &&
        game.players.filter((player) => !player.readyToSelect).length == 0
    ) {
        startSelect(game);
    }
};

const readyUpPlay = (gameId, user) => {
    console.log(user._id);
    const game = idToGameMap[gameId];

    let found = false;
    for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        if (player._id === user._id) {
            console.log("found " + user._id);
            found = true;
            if (player.readyToPlay) return true;
            //only reading in the selecting stage once player has selected all top cards
            if (game.gameState == "selecting") {
                if (player.tops.length < 3) {
                    return false;
                }
            }
            player.readyToPlay = true;
            break;
        }
    }

    if (
        found &&
        game.players.length > 1 &&
        game.players.filter((player) => !player.readyToPlay).length == 0
    ) {
        startGame(game);
    }
};

const startGame = (game) => {
    game.gameState = "playing";
};

const startSelect = (game) => {
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
};

const redraw = (game) => {
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

const selectTop = (gameId, user, idx) => {
    game = idToGameMap[gameId];
    if (game.gameState !== "selecting") {
        return false;
    }
    for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];

        if (player._id === user._id) {
            console.log(user._id);
            //pop selected card and put it in tops
            if (player.tops.length < 3) {
                player.tops.push(player.deck[idx]);
                player.deck.splice(idx, 1);
                game.players[i] = player;
                console.log(game.players);
            }
            break;
        }
    }
};

const selectPlay = (gameId, user, idx) => {
    console.log("WHAT");
    //must be in selecting mode
    //TODO implement bombing out of turn
    console.log("try to play");
    console.log(gameId);
    game = idToGameMap[gameId];
    console.log(game);
    if (game.gameState !== "playing" || game.players[0]._id !== user._id) {
        return false;
    }
    // console.log("playing");
    //TODO implement bombing on turn
    //TODO implement 2,10,7
    const player = game.players[0];
    if (
        game.pile.length === 0 ||
        (player.deck[idx].value >= game.pile[game.pile.length - 1].value &&
            game.pile[game.pile.length - 1].value !== 9) ||
        (player.deck[idx].value < game.pile[game.pile.length - 1].value &&
            game.pile[game.pile.length - 1].value === 9)
    ) {
        //delete card in hand and put it on top of pile
        const card = game.players[0].deck.splice(idx, 1)[0];
        game.pile.push({ value: card.value, suit: card.suit });
        //draw
        console.log("redraw time");
        redraw(game);
        //TODO implement playing multiple cards logic
        //rotate players
        game.players.push(game.players.shift());
        console.log(game.pile);
    }
    //res.send({ 1: "selectPlayDone" });
};

const take = (gameId, user) => {
    console.log("????");
    //must be in selecting mode
    //TODO implement bombing out of turn
    // console.log("try to take");
    game = idToGameMap[gameId];
    if (
        game.gameState !== "playing" ||
        game.players[0]._id !== user._id ||
        game.pile.length === 0
    ) {
        return false;
    } else {
        game.players[0].deck.push(...game.pile);
        game.pile = [];
        //rotate players
        game.players.push(game.players.shift());
        // console.log(game.pile);
    }
};

module.exports = {
    idToGameMap,
    addPlayerToGame,
    selectTop,
    selectPlay,
    take,
    readyUpSelect,
    readyUpPlay,
};
