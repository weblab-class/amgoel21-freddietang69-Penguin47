import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { handleInput } from "../../input";
import Opponent from "./Opponent.js";
import "../../utilities.css";
import "./Game.css";

const Game = (props) => {
    const [gameID, setgameID] = useState(undefined);
    const [ready, setReady] = useState(false);
    const [tops, setTops] = useState([]);
    const [bottoms, setBottoms] = useState(3);
    const [deck, setDeck] = useState(0);
    const [playerDeck, setplayerDeck] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selected, setSelected] = useState(undefined);
    const [pile, setPile] = useState([]);
    // 0 = not started
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
        setReady(update.ready);
        setgameState(update.gameState);
        setTops(update.players[update.player_pos].tops);
        setBottoms(update.players[update.player_pos].bottoms);
        setplayerDeck(update.player_deck);
        setPlayers(update.players);
        setDeck(update.deck);
        setPile(update.pile);
    };

    const readyUp = () => {
        if (gameID !== undefined) {
            socket.emit("ready", gameID);
        }
    };

    const select = () => {
        console.log("attempted select");
        if (selected !== undefined) {
            if (gameState === "selecting") {
                socket.emit("selectTop", { idx: selected, gameId: gameID });
                setSelected(undefined);
            } else if (gameState === "playing") {
                console.log("playing select");
                socket.emit("selectPlay", { idx: selected, gameId: gameID });
                setSelected(undefined);
            }
        }
    };

    const take = () => {
        socket.emit("take", gameID);
    };

    return (
        <>
            <div className="text-white">
                {gameState !== "waiting" && <button onClick={select}>Select</button>}
            </div>
            <div className="text-white">{!ready && <button onClick={readyUp}>Ready?</button>}</div>
            <div className="text-white">
                {players.map((player, index) => {
                    return <Opponent key={index} player={player}></Opponent>;
                })}
            </div>
            <div className="text-white">
                {gameState === "playing" && <button onClick={take}>Take</button>}
            </div>
            <div className="text-white">
                {playerDeck.map((card, index) => {
                    return selected === index ? (
                        <button
                            className="text-white font-bold underline"
                            onClick={() => {
                                setSelected(index);
                            }}
                            key={index}
                        >
                            ({card.value} of {card.suit})
                        </button>
                    ) : (
                        <button
                            className="text-white"
                            onClick={() => {
                                setSelected(index);
                            }}
                            key={index}
                        >
                            ({card.value} of {card.suit})
                        </button>
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

export default Game;
