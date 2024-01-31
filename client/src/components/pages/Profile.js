import { useParams } from "react-router-dom";
import React from "react";

import NavBar from "../modules/NavBar.js";

/**
 * Hub has list of lobbies and possibly? chat room
 *
 * Proptypes
 * @param {string} userId
 */
const Profile = ({ userId, handleLogin, handleLogout }) => {
    const profileId = useParams().profileId;
    console.log(profileId);
    return (
        <>
            <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
            <div className="text-center m-[20%]">{profileId}</div>
        </>
    );
};

export default Profile;
