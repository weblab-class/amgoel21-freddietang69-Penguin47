import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

import { get } from "../../utilities.js";

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "707563753460-4ihlvt7ht9nsnrfsvj1j5r676kiommac.apps.googleusercontent.com";

const NavBar = ({ userId, handleLogin, handleLogout }) => {
    const [userName, setUserName] = useState("default");
    useEffect(() => {
        if (userId) {
            get("/api/user", { _id: userId }).then((data) => {
                setUserName(data.name);
            });
        }
    }, [userId]);

    return (
        <nav className="bg-teal-300 h-8 flex">
            <div className="inline-block w-4/6">
                <Link to="/" className="NavBar-link">
                    Home
                </Link>
                <Link to="/rules" className="NavBar-link">
                    Rules
                </Link>
                <Link to="/about" className="NavBar-link">
                    About
                </Link>
                <Link to="/stats" className="NavBar-link">
                    Stats
                </Link>
                <Link to="/hub" className="NavBar-link">
                    Go to games
                </Link>
                <Link to="/game" className="NavBar-link">
                    game
                </Link>
            </div>
            <div className="inline-block">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    {userId ? (
                        <button
                            onClick={() => {
                                googleLogout();
                                handleLogout();
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <GoogleLogin
                            clientId={GOOGLE_CLIENT_ID}
                            buttonTest="Login"
                            onSuccess={handleLogin}
                            onError={(err) => console.log(err)}
                        />
                    )}
                </GoogleOAuthProvider>
            </div>
            <div className="inline-block pl-4">{userName}</div>
        </nav>
    );
};

export default NavBar;
