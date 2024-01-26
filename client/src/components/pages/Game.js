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

    // add event listener on mount
    useEffect(() => {
        // console.log("what");
        // console.log(props.userId);
        if (props.userId) {
            get("/api/user", { _id: props.userId }).then((data) => {
                const body = { user: data, name: "1" };
                // post("/api/makegame", body).then((data) => {
                //   setgameID(data);
                // });
                post("/api/addgameplayer", body).then((data) => {
                    setgameID(data);
                });
            });
        } else {
            // console.log("something");
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
            get("/api/user", { _id: props.userId }).then((data) => {
                post("/api/ready", { game_id: gameID, user: data }).then((data) => {
                    if (data) {
                        setReady(true);
                    }
                });
            });
        }
    };
    // display text if the player is not logged in
    let loginModal = null;
    if (!props.userId) {
        loginModal = <div className="text-white"> Please Login First! </div>;
    }

    const select = () => {
        console.log("attempted select");
        if (selected !== undefined) {
            if (gameState === "selecting") {
                post("/api/selectTop", { idx: selected, game_id: gameID });
                setSelected(undefined);
            } else if (gameState === "playing") {
                console.log("playing select");
                post("/api/selectPlay", { idx: selected, game_id: gameID }).then((stuff) => {
                    console.log(stuff);
                });
                get("/api/hi", {});
                setSelected(undefined);
            }
        }
    };

    const take = () => {
        post("/api/take", { game_id: gameID }).then((stuff) => {
            console.log(stuff);
        });
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
                            {JSON.stringify(card)}
                        </button>
                    ) : (
                        <button
                            className="text-white"
                            onClick={() => {
                                setSelected(index);
                            }}
                            key={index}
                        >
                            {JSON.stringify(card)}
                        </button>
                    );
                })}
            </div>
            <div className="text-white">
                <h3>Pile</h3>
                {pile.map((card, index) => {
                    return (
                        <div key={index} className="text-white">
                            {JSON.stringify(card)}
                        </div>
                    );
                })}
            </div>
            <div className="text-white"></div>
        </>
    );
};

export default Game;
