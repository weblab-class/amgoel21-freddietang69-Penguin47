import React, { useState, useEffect } from "react";

import { get, post } from "../../utilities.js";

/**
 * Lobby is a component that renders a single lobby in the hub
 * It renders the lobby information: name, players, etc
 *
 * Proptypes
 * @param {string} userId
 * @param {lobby object} lobby of the lobby
 */
const Lobby = (props) => {
    // const [playerNames, setPlayerNames] = useState([]);

    // useEffect(() => {
    //   //const t = [];
    //   // props.lobby.players.forEach((element) => {
    //   //   //console.log(props.lobby.name, element, "hi");
    //   //   if (element) {
    //   //     get("/api/user", { _id: element }).then((data) => {
    //   //       //console.log(element);
    //   //       //console.log(data);
    //   //       const yo = playerNames.concat([data.name]);
    //   //       console.log(yo);
    //   //       setPlayerNames(yo);
    //   //       console.log(props.lobby.name, playerNames);
    //   //     });
    //   //   }
    //   // });

    //   // console.log(t);
    //   // setPlayerNames(t);
    //   // console.log(playerNames);
    // }, []);

    const joinLobby = () => {
        post("/api/addlobbyplayer", { lobby: props.lobby }).then((data) => {
            window.location = "/game/" + props.lobby._id;
            // console.log("hey babe");
        });
    };

    // const playerNames = props.lobby.players.map((id) => {
    //   function getName() {
    //     //return await get("/");
    //     return id;
    //   }
    //   return getName();
    // });
    return (
        <div className="bg-yellow-500 flex items-stretch">
            <div className="flex-auto">Lobby {props.lobby.name}</div>
            <div className="flex-auto">
                {" "}
                Players:{" "}
                {props.lobby.players.map((player, key) => (
                    <div>
                        {key + 1}:{player.name}
                    </div>
                ))}{" "}
            </div>
            <button className="flex-auto" onClick={joinLobby}>
                Click to join
            </button>
        </div>
    );
};

export default Lobby;
