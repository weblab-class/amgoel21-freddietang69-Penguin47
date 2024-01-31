import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { get, post } from "../../utilities.js";

/**
 * Lobby is a component that renders a single lobby in the hub
 * It renders the lobby information: name, players, etc
 *
 * Proptypes
 * @param {string} userId
 * @param {lobby object} lobby of the lobby
 */
const Lobby = ({ userId, lobby }) => {
    const navigate = useNavigate();
    const joinLobby = () => {
        post("/api/addlobbyplayer", { lobby: lobby }).then((data) => {
            navigate("/game/" + lobby._id);
        });
    };

    return (
        <div className="bg-yellow-500 border-2 border-black flex m-2">
            <div className="basis-1/2">
                <div className="text-center">{lobby.name}</div>
                <div className="text-center">Players: {lobby.players.length}</div>
                <div className="text-center">{lobby.creator.name}</div>
            </div>
            <div className="basis-1/2 flex justify-center items-center">
                {userId ? (
                    <button onClick={joinLobby}>Click to join </button>
                ) : (
                    <div>Can't join until logged in</div>
                )}
            </div>
        </div>
    );
};

export default Lobby;
