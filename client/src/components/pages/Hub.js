import React from "react";

import NavBar from "../modules/NavBar.js";
import LobbyList from "../modules/LobbyList.js";

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
            <LobbyList userId={userId} />
        </>
    );
};

export default Hub;
