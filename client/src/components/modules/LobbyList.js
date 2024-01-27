import React, { useState, useEffect } from "react";

import Lobby from "./Lobby.js";
import { get, post } from "../../utilities.js";

import { socket } from "../../client-socket.js";

/**
 * LobbyList renders the list of lobbies in the hub
 *
 * Proptypes
 * @param {string} userId
 */
const LobbyList = (props) => {
    const [lobbies, setLobbies] = useState([]);
    const [value, setValue] = useState("default");

    useEffect(() => {
        get("/api/lobbies", {}).then((data) => {
            setLobbies(data);
            //console.log(data);
        });
    }, []);

    useEffect(() => {
        const callback = (data) => {
            get("/api/lobbies", {}).then((lobbyData) => {
                setLobbies(lobbyData);
                console.log(lobbyData);
            });
        };
        socket.on("lobby", callback);
        return () => {
            socket.off("lobby", callback);
        };
    }, []);

    const getLobbyList = () => {
        get("/api/lobbies", {}).then((data) => {
            console.log(data);
        });
    };

    const makeLobby = () => {
        post("/api/makelobby", { name: value }).then((gameId) => {
            window.location = "/game/" + gameId;
        });
    };

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div>
            {/* <div className="bg-red-500">
                <button className="text-white" onClick={getLobbyList}>
                    What are the lobbies
                </button>
            </div> */}
            <div className="bg-red-500">
                {props.userId ? (
                    <div>
                        <input placeholder="Lobby Name" onChange={onChange}></input>
                        <button className="text-white" onClick={makeLobby}>
                            Create New Lobby
                        </button>
                    </div>
                ) : (
                    "You cannot make a lobby"
                )}
            </div>
            {/* <Lobby lobby={{ name: "test 1" }} />
      <Lobby lobby={{ name: "test 2" }} /> */}
            {lobbies.map((lobby) => {
                return <Lobby userId={props.userId} lobby={lobby} key={lobby._id}></Lobby>;
            })}
        </div>
    );
};

export default LobbyList;
