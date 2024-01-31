import React from "react";

import NavBar from "../modules/NavBar.js";
import LobbyList from "../modules/LobbyList.js";
import Chat from "../modules/Chat.js";

/**
 * Hub has list of lobbies and possibly? chat room
 *
 * Proptypes
 * @param {string} userId
 */
const Hub = ({ userId, handleLogin, handleLogout }) => {
    return (
        <>
            <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
            <div className="flex">
                <div className="basis-2/3">
                    <LobbyList userId={userId} />
                </div>
                <div className="basis-1/3">
                    <Chat />
                </div>
            </div>
        </>
    );
};

export default Hub;
