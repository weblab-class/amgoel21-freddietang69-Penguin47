import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { post } from "../../utilities";
import Opponent from "./Opponent.js";
import "../../utilities.css";
import "./Game.css";

import CardContainer from "../modules/CardContainer.js";

const GameWaiting = ({ gameID, readySelect }) => {
    const readyUpSelect = () => {
        if (gameID !== undefined) {
            socket.emit("readySelect", gameID);
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

const GameSelecting = ({ gameID, gameState, players, playerDeck }) => {
    const [selected, setSelected] = useState([false, false, false, false, false, false]);
    const locked = useRef(false);

    const readyUpPlay = () => {
        if (gameID !== undefined && selected.filter((val) => val).length == 3) {
            locked.current = true;
            console.log(selected);
            socket.emit("selectTop", { gameId: gameID, selected: selected });
            socket.emit("readyPlay", gameID);
        }
    };

    return (
        <>
            <div className="text-white">
                <button onClick={readyUpPlay}>Ready?</button>
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
    );
};

const GamePlayScreen = ({ gameID, gameState, players, playerDeck, pile }) => {
    const [selected, setSelected] = useState(undefined);

    const select = () => {
        console.log("attempted select");
        if (selected !== undefined) {
            console.assert(gameState == "playing");
            console.log("playing select");
            socket.emit("selectPlay", { idx: selected, gameId: gameID });
            setSelected(undefined);
        }
    };

    const take = () => {
        socket.emit("take", gameID);
    };

    return (
        <>
            <div className="text-white">
                <button onClick={select}>Select</button>
            </div>
            <div className="text-white">
                {players.map((player, index) => {
                    console.log(players);
                    return <Opponent key={index} player={player}></Opponent>;
                })}
            </div>
            <div className="text-white">
                <button onClick={take}>Take</button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {playerDeck.map((card, index) => {
                    return (
                        <div class="grid place-items-center">
                            <CardContainer
                                card={card}
                                width={150}
                                highlighted={selected === index}
                                onClick={() => {
                                    setSelected(index);
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="text-white">
                <h3>Pile</h3>
                {pile.map((card, index) => {
                    return (
                        <div key={index} className="text-white">
                            ({card.value} of {card.suit})
                        </div>
                    );
                })}
            </div>
            <div className="text-white"></div>
        </>
    );
};

const Game = (props) => {
    const [gameID, setgameID] = useState(undefined);
    const [readySelect, setReadySelect] = useState(false);
    const [readyPlay, setReadyPlay] = useState(false);
    const [tops, setTops] = useState([]);
    const [bottoms, setBottoms] = useState(3);
    const [deck, setDeck] = useState(0);
    const [playerDeck, setplayerDeck] = useState([]);
    const [players, setPlayers] = useState([]);
    const [pile, setPile] = useState([]);
    const [gameState, setgameState] = useState("waiting");

    useEffect(() => {
        if (props.userId) {
            post("/api/addgameplayer", { name: "test" }).then((data) => {
                setgameID(data);
            });
        }
    }, [props.userId]);

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
    };

    return (
        <>
            {!props.userId ? (
                <div class="text-white">Please Log In</div>
            ) : gameState === "waiting" ? (
                <GameWaiting gameID={gameID} readySelect={readySelect} />
            ) : gameState === "selecting" ? (
                <GameSelecting
                    gameID={gameID}
                    gameState={gameState}
                    players={players}
                    playerDeck={playerDeck}
                />
            ) : (
                <GamePlayScreen
                    gameID={gameID}
                    gameState={gameState}
                    players={players}
                    playerDeck={playerDeck}
                    pile={pile}
                />
            )}
        </>
    );
};

export default Game;
