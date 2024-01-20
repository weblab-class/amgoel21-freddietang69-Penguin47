import React from "react";

import LobbyList from "../modules/LobbyList.js";

/**
 * Hub has list of lobbies and possibly? chat room
 *
 * Proptypes
 * @param {string} userId
 */
const Hub = (props) => {
  return (
    <>
      <LobbyList userId={props.userId} />
      <div className="text-white">todo: make lobbies</div>
      <div className="text-white">yaaaaaaa</div>
    </>
  );
};

export default Hub;
