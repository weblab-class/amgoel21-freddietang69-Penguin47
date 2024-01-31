import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./Profile.css";

const Profile = (props) => {
    const [catHappiness, setCatHappiness] = useState(0);
    const [user, setUser] = useState();

    useEffect(() => {
        document.title = "Profile Page";
        get(`/api/user`, { _id: props.userId }).then((userObj) => setUser(userObj));
    }, []);

    if (!user) {
        return <div> Loading! </div>;
    }
    return (
        <div className="text-white">
            <h1 className="Profile-name u-textCenter">{user.name}</h1>
            <hr className="Profile-linejj" />
            <div className="u-flex">
                <div className="Profile-subContainer u-textCenter">
                    <h4 className="Profile-subTitle">About Me</h4>
                    <div id="profile-description">
                        {user.bio === "" ? "Nothing here!" : user.bio}
                    </div>
                </div>
                <div className="Profile-subContainer u-textCenter">
                    <h4 className="Profile-subTitle">Wins</h4>
                    <div>{user.wins}</div>
                </div>
                <div className="Profile-subContainer u-textCenter">
                    <h4 className="Profile-subTitle">Losses</h4>
                    <div>{user.losses}</div>
                </div>
            </div>
            <div className="text-white flex justify-center Game-winner">
                <Link to="/">back to home</Link>
            </div>
            {user.userId === props.userId}
        </div>
    );
};

export default Profile;
