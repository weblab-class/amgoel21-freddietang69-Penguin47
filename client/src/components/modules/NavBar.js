import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

import { get } from "../../utilities.js";
import logo from "../../palace.jpg";

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "707563753460-4ihlvt7ht9nsnrfsvj1j5r676kiommac.apps.googleusercontent.com";

const NavBar = ({ userId, handleLogin, handleLogout }) => {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        if (userId) {
            get("/api/user", { _id: userId }).then((data) => {
                setUserName(data.name);
            });
        }
    }, [userId]);

    return (
        <div className="NavBar-container text-white">
            <div className="absolute left-0 top-0 h-full w-1/5">
                <a href="/">
                    <img src={logo} alt="Palace" width={100}></img>
                </a>
            </div>
            <div className="absolute left-[20%] top-0 h-full w-3/5 flex justify-center items-center gap-8">
                <Link to="/rules" className="NavBar-link">
                    Learn about Rules
                </Link>
                {/* <Link to="/about" className="NavBar-link">
                    About
                </Link>
                <Link to="/stats" className="NavBar-link">
                    Stats
                </Link> */}
                <Link to="/hub" className="NavBar-link">
                    Join a Game
                </Link>
                <Link to={"/profile/" + userId} className="NavBar-link">
                    Profile
                </Link>
            </div>
            <div className="absolute left-[80%] top-0 h-full w-1/5 flex justify-center items-center gap-8">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    {userId ? (
                        <>
                            <button
                                onClick={() => {
                                    googleLogout();
                                    handleLogout();
                                }}
                                className="text-xl"
                            >
                                Logout
                            </button>
                            <div className="text-xl">{userName}</div>
                        </>
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
        </div>
    );
};

export default NavBar;
