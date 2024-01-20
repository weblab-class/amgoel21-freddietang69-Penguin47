import React from "react";

/**
 * Lobby is a component that renders a single lobby in the hub
 * It renders the lobby information: name, players, etc
 *
 * Proptypes
 * @param {lobby object} lobby of the lobby
 */
const Lobby = (props) => {
  console.log(props.lobby);
  return <div className="bg-yellow-500">Lobby {props.lobby.name}</div>;
};

export default Lobby;
