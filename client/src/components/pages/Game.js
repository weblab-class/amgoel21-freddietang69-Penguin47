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
  // TODO (Step 6.5): initialize winnerModal state
  // Uncomment the following code:

  // add event listener on mount
  useEffect(() => {
    console.log("what");
    console.log(props.userId);
    get("/api/user", { _id: props.userId }).then((data) => {
      const body = { user: data, name: "1" };
      // post("/api/makegame", body).then((data) => {
      //   setgameID(data);
      // });
      post("/api/addgameplayer", body).then((data) => {
        setgameID(data);
      });
    });
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleInput);

    // remove event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleInput);
      // TODO (Step 6.4): send a post request with user id to despawn api (1 line)
      post("/api/despawn");
    };
  }, []);

  // update game periodically
  useEffect(() => {
    socket.on("update", (update) => {
      processUpdate(update);
    });
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
      post("/api/ready", { game_id: gameID }).then((data) => {
        if (data) {
          setReady(true);
        }
      });
    }
  };
  // display text if the player is not logged in
  let loginModal = null;
  if (!props.userId) {
    loginModal = <div className="text-white"> Please Login First! </div>;
  }
  const select = () => {
    if (selected !== undefined) {
      if (gameState === "selecting") {
        post("/api/selectTop", { idx: selected, game_id: gameID });
        setSelected(undefined);
      } else if (gameState === "playing") {
        post("/api/selectPlay", { idx: selected, game_id: gameID });
        setSelected(undefined);
      }
    }
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
        {playerDeck.map((card, index) => {
          return (
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
      <div className="text_white"></div>
    </>
  );
};

export default Game;
