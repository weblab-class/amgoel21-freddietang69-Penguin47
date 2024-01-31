import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Lobby from "./Lobby.js";
import { get, post } from "../../utilities.js";

import { socket } from "../../client-socket.js";

/**
 * LobbyList renders the list of lobbies in the hub
 *
 * Proptypes
 * @param {string} userId
 */
const LobbyList = ({ userId }) => {
    const [lobbies, setLobbies] = useState([]);
    const [value, setValue] = useState("");
    const navigate = useNavigate();

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

    const makeLobby = () => {
        if (value) {
            post("/api/makelobby", { name: value }).then((data) => {
                navigate("/game/" + data.gameId);
            });
            setValue("");
        }
    };

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className="mx-[15%] my-16 bg-gray-300 border-2 border-black rounded-2xl px-8 pb-8">
            <div className="p-2 flex justify-center">
                {userId ? (
                    <div>
                        <input placeholder="Lobby" onChange={onChange}></input>
                        <button className="text-black mx-2 p-1 bg-slate-400 rounded-full" onClick={makeLobby}>
                            Create New Lobby
                        </button>
                    </div>
                ) : (
                    "You cannot make a lobby"
                )}
            </div>
            <div className="grid grid-cols-2 gap-8">
                {lobbies.map((lobby) => {
                    return <Lobby userId={userId} lobby={lobby} key={lobby._id}></Lobby>;
                })}
            </div>
        </div>
    );
};

export default LobbyList;
