import React, { useState, useEffect } from "react";

import Lobby from "./Lobby.js";
import { get, post } from "../../utilities.js";

/**
 * LobbyList renders the list of lobbies in the hub
 *
 * Proptypes
 * @param {string} userId
 */
const LobbyList = (props) => {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    get("/api/lobbies", {}).then((data) => {
      setLobbies(data);
      console.log(data);
    });
  }, []);

  const getLobbyList = () => {
    get("/api/lobbies", {}).then((data) => {
      console.log(data);
    });
  };

  const makeLobby = () => {
    console.log(props);
    post("/api/makelobby", { userId: props.userId, name: "c" });
  };

  return (
    <div>
      <div className="bg-red-500">
        <button className="text-white" onClick={getLobbyList}>
          What are the lobbies
        </button>
      </div>
      <div className="bg-red-500">
        <button className="text-white" onClick={makeLobby}>
          Make a Lobby
        </button>
      </div>
      {/* <Lobby lobby={{ name: "test 1" }} />
      <Lobby lobby={{ name: "test 2" }} /> */}
      {lobbies.map((lobby) => {
        return <Lobby lobby={lobby} key={lobby._id}></Lobby>;
      })}
    </div>
  );
};

export default LobbyList;
