import React from "react";

/**
 * Lobby is a component that renders a single lobby in the hub
 * It renders the lobby information: name, players, etc
 *
 * Proptypes
 * @param {string} _id of the lobby
 */
const Lobby = (props) => {
  return <div className="bg-yellow-500">Lobby {props._id}</div>;
};

export default Lobby;
