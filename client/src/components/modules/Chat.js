import React, { useState, useEffect } from "react";

import { get, post } from "../../utilities";

import { socket } from "../../client-socket.js";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");

    useEffect(() => {
        get("/api/messages").then((data) => {
            setMessages(data);
        });
    }, []);

    useEffect(() => {
        const callback = (useless) => {
            get("/api/messages").then((data) => {
                setMessages(data);
            });
        };
        socket.on("message", callback);
        return () => {
            socket.off("message", callback);
        };
    }, []);

    const submitMessage = () => {
        if (value) {
            post("/api/message", { content: value });
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
        <div>
            {messages.map((message, index) => {
                return (
                    <div index={index}>
                        {message.creator} | {message.content}
                    </div>
                );
            })}
            <div>
                <input
                    placeholder="Message"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                ></input>
                <button type="submit" onClick={submitMessage}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Chat;
