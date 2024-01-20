import React from "react";

import { post } from "../../utilities.js";

/**
 * Lobby is a component that renders a single lobby in the hub
 * It renders the lobby information: name, players, etc
 *
 * Proptypes
 * @param {string} userId
 * @param {lobby object} lobby of the lobby
 */
const Lobby = (props) => {
  const joinLobby = () => {
    //console.log("Lobby", props.userId);
    post("/api/addlobbyplayer", { userId: props.userId, lobby: props.lobby });
  };

  const playerNames = props.lobby.players.map((id) => {
    function getName() {
      //return await get("/");
      return id;
    }
    return getName();
  });
  return (
    <div className="bg-yellow-500 flex items-stretch">
      <div className="flex-auto">Lobby {props.lobby.name}</div>
      <div className="flex-auto">Players: {playerNames}</div>
      <button className="flex-auto" onClick={joinLobby}>
        Click to join
      </button>
    </div>
  );
};

export default Lobby;
