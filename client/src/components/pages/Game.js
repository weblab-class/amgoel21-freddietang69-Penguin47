import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import Opponents from "../modules/Opponents.js";
import "../../utilities.css";
import "./Game.css";

import CardContainer from "../modules/CardContainer.js";
import { useParams } from "react-router-dom";

const GameWaiting = ({ gameId, readySelect }) => {
    const readyUpSelect = () => {
        if (gameId !== undefined) {
            socket.emit("readySelect", gameId);
        }
    };
    return (
        <div className="flex h-80 items-center justify-center">
            {!readySelect ? (
                <button
                    class="text-white bg-blue-400 px-4 py-2 rounded-full font-bold"
                    onClick={readyUpSelect}
                >
                    Click to ready up
                </button>
            ) : (
                <div class="text-white">Waiting on other players</div>
            )}
        </div>
    );
};

const GameSelecting = ({ gameId, gameState, players, playerDeck }) => {
    const [selected, setSelected] = useState([false, false, false, false, false, false]);
    const locked = useRef(false);

    const readyUpPlay = () => {
        if (gameId !== undefined && selected.filter((val) => val).length == 3) {
            locked.current = true;
            console.log("top select", selected);
            socket.emit("selectTop", { gameId: gameId, selected: selected });
            socket.emit("readyPlay", gameId);
        }
    };

    return (
        <>
            {!locked.current ? (
                <>
                    <div className="text-white flex justify-center">
                        <button onClick={readyUpPlay} className="steal-button">
                            Ready?
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {playerDeck.map((card, index) => {
                            return (
                                <div class="grid place-items-center">
                                    <CardContainer
                                        card={card}
                                        width={150}
                                        highlighted={!locked.current && selected[index]}
                                        onClick={() => {
                                            if (!locked.current) {
                                                const newSelected = [...selected];
                                                newSelected[index] = !selected[index];
                                                setSelected(newSelected);
                                                // console.log(index);
                                                // console.log(selected);
                                            }
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="text-white">Waiting for other players to lock in</div>
            )}
        </>
    );
};

const GamePlayScreen = ({ userId, gameId, gameState, players, playerDeck, pile, turn, deck }) => {
    const [selected, setSelected] = useState(new Set());
    // Adding a value
    const addToSelected = (newValue) => {
        console.log(newValue);
        if (selected.has(newValue)) {
            const newSet = new Set([...selected].filter((value) => value !== newValue));
            setSelected(newSet);
        } else {
            const newSet = new Set([...selected, newValue]);
            console.log(newSet);
            setSelected(newSet);
        }
    };

    const select = () => {
        console.log("attempted select");
        if (selected.size !== 0) {
            console.assert(gameState == "playing");
            console.log("playing select", gameId);
            console.log(selected);
            socket.emit("selectPlay", { idx: Array.from(selected), gameId: gameId });
            setSelected(new Set());
        }
    };

    const take = () => {
        socket.emit("take", gameId);
    };

    const pass = () => {
        if (selected.size < 2) {
            if (select.size > 0) {
                console.log("using three:", Array.from(selected)[0]);
            }
            socket.emit("pass", {
                gameId: gameId,
                idx: selected.size === 0 ? -1 : Array.from(selected)[0],
            });
        }
        setSelected(new Set());
    };

    const steal = (victim) => {
        if (selected.size === 1) {
            console.log("attempted steal");
            socket.emit("steal", { gameId: gameId, idx: Array.from(selected)[0], victim: victim });
        }
    };
    const swap = () => {
        if (selected.size === 2) {
            if (select.size > 0) {
                console.log("using three:", Array.from(selected)[0]);
            }
            socket.emit("swap", {
                gameId: gameId,
                cards: Array.from(selected),
            });
        }
    };
    return (
        <div className="relative">
            <div className="text-white absolute left-0 up-0 w-1/2">
                <Opponents
                    steal={steal}
                    players={players}
                    turn={turn}
                    userId={userId}
                    deck={deck}
                />
            </div>
            <div className="text-white absolute left-1/2 up-0 w-1/2">
                <div className="up-0 flex justify-center gap-8 my-8">
                    <button onClick={select} className="steal-button">
                        Select
                    </button>
                    <button onClick={take} className="steal-button">
                        Take
                    </button>
                    <button onClick={pass} className="steal-button">
                        Pass
                    </button>
                    <button onClick={swap} className="steal-button">
                        Swap Cards
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 my-16">
                    {playerDeck.map((card, index) => {
                        return (
                            <div key={index} class="grid place-items-center">
                                <CardContainer
                                    card={card}
                                    width={150}
                                    highlighted={selected.has(index)}
                                    onClick={() => {
                                        addToSelected(index);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="text-white">
                    <h1 className="flex justify-center my-4">Pile</h1>
                    <div className="grid grid-cols-7 gap-3 mx-4">
                        {pile.map((card, index) => {
                            return <CardContainer card={card} width={100} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Game = ({ userId }) => {
    document.body.style = "background: rgb(5, 6, 23);";

    const gameId = useParams().gameId;
    const [readySelect, setReadySelect] = useState(false);
    const [readyPlay, setReadyPlay] = useState(false);
    const [tops, setTops] = useState([]);
    const [bottoms, setBottoms] = useState(3);
    const [deck, setDeck] = useState(0);
    const [playerDeck, setplayerDeck] = useState([]);
    const [players, setPlayers] = useState([]);
    const [pile, setPile] = useState([]);
    const [gameState, setgameState] = useState("waiting");
    const [turn, setTurn] = useState(0);
    const [block, setBlock] = useState(-1);

    useEffect(() => {
        if (userId) {
            console.log(userId, gameId);
            post("/api/addgameplayer", { gameId: gameId });
        }
    }, [userId]);

    // update game periodically
    useEffect(() => {
        socket.on("update", (update) => {
            processUpdate(update);
        });
        return () => {
            socket.off("update", (update) => {
                processUpdate(update);
            });
        };
    }, []);

    useEffect(() => {
        socket.on("block", (info) => {
            setBlock(info.stealer);
        });
        return () => {
            socket.off("block", (info) => {
                setBlock(info.stealer);
            });
        };
    }, []);

    const processUpdate = (update) => {
        setReadySelect(update.readySelect);
        setReadyPlay(update.readyPlay);
        setgameState(update.gameState);
        setTops(update.players[update.player_pos].tops);
        setBottoms(update.players[update.player_pos].bottoms);
        setplayerDeck(update.player_deck);
        setPlayers(update.players);
        setDeck(update.deck);
        setPile(update.pile);
        setTurn(update.turn);
    };

    const respond = (response) => {
        socket.emit("block", { gameId: gameId, response: response });
        setBlock(-1);
    };

    return (
        <>
            {!userId ? (
                <div class="text-white">Please Log In</div>
            ) : gameState === "waiting" ? (
                <GameWaiting gameId={gameId} readySelect={readySelect} />
            ) : gameState === "selecting" ? (
                <GameSelecting
                    gameId={gameId}
                    gameState={gameState}
                    players={players}
                    playerDeck={playerDeck}
                />
            ) : block === -1 ? (
                <GamePlayScreen
                    userId={userId}
                    gameId={gameId}
                    gameState={gameState}
                    players={players}
                    playerDeck={playerDeck}
                    pile={pile}
                    turn={turn}
                    deck={deck}
                />
            ) : (
                <div className="text-white steal-confirmation-page">
                    <h1>{players[block].name} is trying to steal from you!</h1>
                    <div className="button-container">
                        <button
                            className="steal-button block"
                            onClick={() => {
                                respond(true);
                            }}
                        >
                            Block
                        </button>
                        <button
                            className="steal-button no-block"
                            onClick={() => {
                                respond(false);
                            }}
                        >
                            Don't Block
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Game;
