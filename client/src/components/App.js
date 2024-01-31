import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import Home from "./pages/Home.js";
import Hub from "./pages/Hub.js";
import Rules from "./pages/Rules.js";
import Game from "./pages/Game.js";
import Profile from "./pages/Profile.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
    const [userId, setUserId] = useState(undefined);

    useEffect(() => {
        get("/api/whoami").then((user) => {
            if (user._id) {
                // they are registed in the database, and currently logged in.
                setUserId(user._id);
            }
        });
    }, []);

    const handleLogin = (credentialResponse) => {
        const userToken = credentialResponse.credential;
        const decodedCredential = jwt_decode(userToken);
        console.log(`Logged in as ${decodedCredential.name}`);
        post("/api/login", { token: userToken }).then((user) => {
            setUserId(user._id);
            post("/api/initsocket", { socketid: socket.id });
        });
    };

    const handleLogout = () => {
        setUserId(undefined);
        post("/api/logout");
    };

    document.body.style = "background: rgb(242, 242, 242);";

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />} />
                <Route path="/rules" element={<Rules handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />} />
                <Route path="/hub" element={<Hub handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />} />
                <Route path="/profile/:profileId" element={<Profile handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />} />
                <Route path="/game/:gameId" element={<Game userId={userId} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
