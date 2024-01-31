/** constants */

const game = require("./models/game");
const User = require("./models/user");
/** Utils! */

/** Helper to generate a random integer */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

idToGameMap = {};

const makeGame = (name, gameId, creator = { name: "default", _id: "default" }) => {
    //console.log(Object.keys(idToGameMap).length);
    let game = {
        name: name,
        _id: gameId,
        creator: creator,
        players: [],
        gameState: "waiting",
        deck: [],
        pile: [],
        turn: 0,
        waiting: -1,
        idx: 0, //for removal in declined block
        winner: -1,
        twoSevenEightTen: [4, 4, 4, 4],
        messages: [],
    };
    console.log("hello", creator);
    idToGameMap[gameId] = game;
};

//makeGame("test");

const addPlayerToGame = (gameId, user) => {
    let game = idToGameMap[gameId];
    let alreadyInGame = false; // MAKE SURE WE DONT ADD SAME PLAYER MULTIPLE TIMES
    for (player of game.players) alreadyInGame |= player._id == user._id;
    if (!alreadyInGame) {
        game.players.push({
            _id: user._id,
            name: user.name,
            deck: [],
            tops: [],
            bottoms: [],
            canPlay: new Set(),
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
                deck.push({ suit: suit, value: value, revealed: false });
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
    const values = [2, 7, 10, 14];
    console.log("custom", game.twoSevenEightTen);
    for (let i = 0; i < values.length; i++) {
        for (const suit of ["hearts", "spades", "clubs", "diamonds"].slice(
            0,
            game.twoSevenEightTen[i]
        )) {
            console.log("interesting");
            deck.push({ suit: suit, value: values[i], revealed: false });
        }
    }

    // for (const suit of ["hearts", "spades", "clubs", "diamonds"]) {
    //     for (let value of [2, 7, 10, 14]) {
    //         deck.push({ suit: suit, value: value, revealed: false });
    //     }
    // }
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

const redraw = (game, val) => {
    const turn = game.turn;
    const ret = new Set();
    while (game.deck.length > 0 && game.players[turn].deck.length < 3) {
        if (game.deck[game.deck.length - 1].value === val) {
            ret.add(game.players[turn].deck.length);
        }
        game.players[turn].deck.push(game.deck.pop());
    }
    if (game.players[turn].deck.length === 0) {
        console.log("got down");
        if (game.players[turn].tops.length > 0) {
            game.players[turn].deck = game.players[turn].tops;
            game.players[turn].tops = [];
        } else if (game.players[turn].bottoms.length > 0) {
            game.players[turn].deck.push(game.players[turn].bottoms.pop());
        } else {
            //TODO declare winner
        }
    }
    return ret;
};

const editCards = (gameId, user, card, value) => {
    const game = idToGameMap[gameId];
    console.log("trying to edit", card, value, user._id, game.creator._id);
    if (game.gameState !== "waiting" || user._id !== game.creator._id) {
        return false;
    }
    console.log("??");
    game.twoSevenEightTen[card] = value;
};

const selectTop = (gameId, user, idx) => {
    const game = idToGameMap[gameId];
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
const pass = (gameId, user, idx) => {
    const game = idToGameMap[gameId];
    if (
        game.waiting !== -1 ||
        game.gameState !== "playing" ||
        game.players[game.turn]._id !== user._id
    ) {
        return false;
    }
    if (game.players[game.turn].canPlay.size > 1) {
        game.players[game.turn].canPlay = new Set();
        game.turn = (game.turn + 1) % game.players.length;
        // game.players.push(game.players.shift());
    } else if (
        idx != -1 &&
        game.players[game.turn].deck[idx].value === 3 &&
        !game.players[game.turn].deck[idx].revealed
    ) {
        game.players[game.turn].deck[idx].revealed = true;
        game.turn = (game.turn + 1) % game.players.length;
        //     game.players.push(game.players.shift());
    }
};
const block = (gameId, user, response) => {
    const game = idToGameMap[gameId];
    if (game.waiting === -1 || game.players[game.waiting]._id !== user._id) {
        return false;
    }
    //did not block
    if (!response) {
        const victim = game.waiting;
        let stealidx = getRandomInt(0, game.players[victim].deck.length);
        let stolenCard = game.players[victim].deck.splice(stealidx, 1)[0];
        stolenCard.revealed = false;
        game.players[game.turn].deck.push(stolenCard);
        game.players[victim].deck.push(game.players[game.turn].deck.splice(game.idx, 1)[0]);
    }
    game.waiting = -1;
    game.turn = (game.turn + 1) % game.players.length;
};
const swap = (gameId, user, cards) => {
    const game = idToGameMap[gameId];
    let useridx = -1;
    for (let i = 0; i < game.players.length; i++) {
        if (game.players[i]._id === user._id) {
            useridx = i;
            break;
        }
    }
    if (
        useridx === -1 ||
        game.waiting !== -1 ||
        game.gameState !== "playing" ||
        game.players[game.turn].canPlay.size > 1
    ) {
        console.log("swap fail");
        return false;
    }
    [game.players[useridx].deck[cards[0]], game.players[useridx].deck[cards[1]]] = [
        game.players[useridx].deck[cards[1]],
        game.players[useridx].deck[cards[0]],
    ];
};
const steal = (gameId, user, idx, victim) => {
    const game = idToGameMap[gameId];
    if (
        game.waiting !== -1 ||
        game.gameState !== "playing" ||
        game.players[game.turn]._id !== user._id ||
        game.players[game.turn].canPlay.size > 1 ||
        game.players[game.turn].deck[idx].value !== 8
    ) {
        return false;
    }

    let topind = -1;
    if (game.pile.length > 0) {
        topind = game.pile.length - 1;
        while (topind >= 0 && game.pile[topind].value === 7) {
            topind--;
        }
    }
    console.log("steal");
    console.log("topind", topind);
    if (
        topind === -1 ||
        (8 >= game.pile[topind].value && game.pile[topind].value !== 9) ||
        game.pile[topind].value === 9
    ) {
        if (game.players[victim].deck.filter((card) => card.value === 8).length == 0) {
            let stealidx = getRandomInt(0, game.players[victim].deck.length);
            let stolenCard = game.players[victim].deck.splice(stealidx, 1)[0];
            stolenCard.revealed = false;
            game.players[game.turn].deck.push(stolenCard);
            game.players[victim].deck.push(game.players[game.turn].deck.splice(idx, 1)[0]);
            game.turn = (game.turn + 1) % game.players.length;
            //  game.players.push(game.players.shift());
            return -1;
        } else {
            console.log("waiting on", victim);
            game.waiting = victim;
            game.idx = idx;
            return victim;
        }
    } else {
        return -1;
    }
};
const selectPlay = (gameId, user, idx) => {
    console.log("WHAT");
    //must be in selecting mode
    //TODO implement bombing out of turn
    console.log("try to play");
    console.log(idx);
    console.log(gameId);
    const game = idToGameMap[gameId];
    const sorted = idx.sort((a, b) => a - b);
    console.log(sorted);
    if (
        game.waiting !== -1 ||
        game.gameState !== "playing" ||
        game.players[game.turn]._id !== user._id
    ) {
        return false;
    }

    // console.log("playing");
    //TODO implement bombing on turn
    const player = game.players[game.turn];
    const val = player.deck[idx[0]].value;
    for (let i of sorted) {
        if (player.deck[i].value !== val) {
            console.log("bad val", player.deck[i].value, val);
            return;
        }
    }
    if (player.canPlay.size > 1) {
        for (let i of sorted) {
            if (!player.canPlay.has(i)) {
                console.log("bad val", player.deck[i].value, val);
                return;
            }
        }
    }
    let topind = -1;
    if (game.pile.length > 0) {
        topind = game.pile.length - 1;
        while (topind >= 0 && game.pile[topind].value === 7) {
            topind--;
        }
    }
    console.log("to play", val);
    console.log("topind", topind);
    if (
        player.canPlay.size > 1 ||
        topind === -1 ||
        val === 2 ||
        val == 7 ||
        ((val === 10 || val >= game.pile[topind].value) && game.pile[topind].value !== 9) ||
        (val < game.pile[topind].value && game.pile[topind].value === 9)
    ) {
        let bomb = true;
        if (sorted.length + game.pile.length >= 4) {
            console.log("dup");
            for (let i = 0; i < 4 - sorted.length; i++) {
                if (game.pile[game.pile.length - i - 1].value !== val) {
                    console.log("fail bomb ", game.pile.length - i - 1);
                    bomb = false;
                    break;
                }
            }
        } else {
            bomb = false;
        }
        //delete card in hand and put it on top of pile
        for (let i = sorted.length - 1; i >= 0; i--) {
            const card = game.players[game.turn].deck.splice(sorted[i], 1)[0];
            game.pile.push({ value: card.value, suit: card.suit, revealed: false });
        }

        if (bomb || val === 10) {
            console.log("bombed");
            game.pile = [];
        }
        //draw
        const news = redraw(game, val);
        if (game.players[game.turn].deck.length === 0) {
            game.winner = game.turn;
            for (let i = 0; i < game.players.length; i++) {
                console.log(game.players[i]);
                User.findOne({ _id: game.players[i]._id }).then((user) => {
                    user.wins += i === game.winner ? 1 : 0;
                    user.losses += i === game.winner ? 0 : 1;
                    user.save();
                });
            }
        }
        game.players[game.turn].canPlay = news;
        //TODO implement playing multiple cards logic
        //rotate players
        if (val !== 2 && val !== 10 && news.size === 0 && !bomb) {
            game.turn = (game.turn + 1) % game.players.length;
            //  game.players.push(game.players.shift());
        } else {
            if (val === 2 || val === 10 || bomb) {
                game.players[game.turn].canPlay = new Set();
            }
            //so can't take anymore
            game.players[game.turn].canPlay.add(-1);
        }
    }
    //res.send({ 1: "selectPlayDone" });
};
//TODO: cannot take after playing a card
const take = (gameId, user) => {
    console.log("taking");
    //must be in selecting mode
    const game = idToGameMap[gameId];
    if (
        game.waiting !== -1 ||
        game.players[game.turn].canPlay.size > 0 ||
        game.gameState !== "playing" ||
        game.players[game.turn]._id !== user._id ||
        game.pile.length === 0
    ) {
        return false;
    } else {
        game.players[game.turn].deck.push(...game.pile);
        game.pile = [];
        //rotate players
        game.turn = (game.turn + 1) % game.players.length;
        //  game.players.push(game.players.shift());
        // console.log(game.pile);
    }
};

module.exports = {
    idToGameMap,
    makeGame,
    addPlayerToGame,
    selectTop,
    selectPlay,
    take,
    pass,
    steal,
    block,
    swap,
    readyUpSelect,
    readyUpPlay,
    editCards,
};
