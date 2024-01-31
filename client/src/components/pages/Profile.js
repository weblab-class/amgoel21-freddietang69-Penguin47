import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import { Link, useParams } from "react-router-dom";

import "../../utilities.css";
import "./Profile.css";

const Profile = ({ userId }) => {
    const [user, setUser] = useState();
    const profileId = useParams().profileId.toString();
    // const profileId = "65b9c98891203e363684c92e";

    useEffect(() => {
        document.title = "Profile Page";
        if (profileId) {
            get(`/api/user`, { _id: profileId }).then((userObj) => {
                if (userObj) {
                    setUser(userObj);
                }
            });
        }
    }, []);

    if (!user) {
        return <div> Loading! </div>;
    }

    if (user.response === "user not found") {
        return <div>User not found.</div>;
    }

    return (
        <div>
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
            {/* {user.userId === userId} */}
        </div>
    );
};

export default Profile;
