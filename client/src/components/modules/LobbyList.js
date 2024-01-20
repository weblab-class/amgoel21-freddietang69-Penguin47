import React from "react";

import Lobby from "./Lobby.js";
import { post } from "../../utilities.js";

/**
 * LobbyList renders the list of lobbies in the hub
 *
 * Proptypes
 * @param {string} userId
 */
const LobbyList = (props) => {
  const makeLobby = () => {
    console.log(props);
    post("/api/makelobby", { userId: props.userId, name: "a" });
  };

  return (
    <div>
      <div className="bg-red-500">
        <button className="text-white" onClick={makeLobby}>
          Make a Lobby
        </button>
      </div>
      <Lobby _id="1" />
      <Lobby _id="2" />
    </div>
  );
};

export default LobbyList;
