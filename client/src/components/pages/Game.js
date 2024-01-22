import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { handleInput } from "../../input";

import "../../utilities.css";
import "./Game.css";

const Game = (props) => {
  const [gameID, setgameID] = useState(undefined);
  const [ready, setReady] = useState(false);
  // 0 = not started
  const [gameState, setgameState] = useState(0);
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
    setgameState();
    // TODO (Step 6.5): set winnerModal if update has defined winner
    // Uncomment the following code:
    if (update.winner) {
      setWinnerModal(
        <div className="Game-winner">the winner is {update.winner} yay cool cool</div>
      );
    } else {
      setWinnerModal(null);
    }
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

  return (
    <>
      <div className="text-white">{!ready && <button onClick={readyUp}>Ready?</button>}</div>
    </>
  );
};

export default Game;
