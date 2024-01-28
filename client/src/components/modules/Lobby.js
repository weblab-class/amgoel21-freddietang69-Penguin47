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
    const joinLobby = () => {
        post("/api/addlobbyplayer", { lobby: props.lobby }).then((data) => {
            window.location = "/game/" + props.lobby._id;
        });
    };
    return (
        <div className="bg-yellow-500 flex items-stretch">
            <div className="flex-auto">Lobby {props.lobby.name}</div>
            <div className="flex-auto">
                <div>Players</div>
                {props.lobby.players.map((player, key) => (
                    <div>
                        {key + 1}:{player.name}
                    </div>
                ))}
            </div>
            {props.userId ? (
                <button className="flex-auto" onClick={joinLobby}>
                    Click to join
                </button>
            ) : (
                <div>Can't join until logged in</div>
            )}
        </div>
    );
};

export default Lobby;
