import React from "react";

import Lobby from "./Lobby.js";

/**
 * LobbyList renders the list of lobbies in the hub
 */
const LobbyList = () => {
  return (
    <div>
      <Lobby _id="1" />
      <Lobby _id="2" />
    </div>
  );
};

export default LobbyList;
