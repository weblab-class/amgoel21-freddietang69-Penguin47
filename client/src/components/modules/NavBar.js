import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "707563753460-4ihlvt7ht9nsnrfsvj1j5r676kiommac.apps.googleusercontent.com";

const NavBar = ({ userId, handleLogin, handleLogout }) => {
  return (
    <nav>
      <div className="u-inlineBlock">
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
      </div>
      <div className="u-inlineBlock">
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
    </nav>
  );
};

export default NavBar;
