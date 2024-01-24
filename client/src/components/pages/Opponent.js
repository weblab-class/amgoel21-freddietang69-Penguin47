import React, { useState, useEffect, useRef } from "react";
import { socket } from "../../client-socket.js";
import { get, post } from "../../utilities";
import { handleInput } from "../../input";

import "../../utilities.css";
import "./Game.css";
const Opponent = (props) => {
  return (
    <span className="text-white">
      <div>{props.player.name}</div>
      <div>{JSON.stringify(props.player.tops)}</div>
      <div>cards in hand {props.player.deck}</div>
      <div>cards in bottom {props.player.bottoms}</div>
    </span>
  );
};

export default Opponent;
