import React, { useState, useEffect } from "react";

import { get, post } from "../../utilities";

import { socket } from "../../client-socket.js";

const Chat = ({ gameId }) => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (gameId) {
            console.log(gameId);
            get("/api/messages", { gameId: gameId }).then((data) => {
                setMessages(data);
            });
        }
    }, []);

    useEffect(() => {
        const callback = (useless) => {
            get("/api/messages", { gameId: gameId }).then((data) => {
                setMessages(data);
            });
        };
        socket.on("message", callback);
        return () => {
            socket.off("message", callback);
        };
    }, []);

    const submitMessage = () => {
        if (value && gameId) {
            post("/api/message", { gameId: gameId, content: value });
            setValue("");
        }
    };

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            submitMessage();
        }
    };

    return (
        <div className="h-64 m-4 bg-slate-400 bg-opacity-20">
            <div className="h-[83%] overflow-auto p-2">
                {messages.map((message, index) => {
                    return (
                        <div key={index}>
                            {message.creator} | {message.content}
                        </div>
                    );
                })}
            </div>
            <div className="h-[10%] p-1">
                <input
                    placeholder="Message"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    className="text-black"
                ></input>
                <button
                    type="submit"
                    onClick={submitMessage}
                    className="border border-green-500 m-2 px-1 bg-gray-100 text-blue-700"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Chat;
