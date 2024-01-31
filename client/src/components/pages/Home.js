import React from "react";

import "./Home.css";
import logo from "../../palace.jpg";
import NavBar from "../modules/NavBar.js";

const Home = ({ userId, handleLogin, handleLogout }) => {
    document.body.style = "background: rgb(242, 242, 242);";
    return (
        <div>
            <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
            <h1 class="mb-4 text-xl flex justify-center font-mono leading-none tracking-tight text-neutral-250 md:text-5xl lg:text-6xl dark:text-black pt-3">
                Let's Play Palace
            </h1>
            <div className="flex justify-center items-center">
                <img src={logo} class="w-[63%]" />
            </div>
            <h1 class="mb-4 text-xl flex justify-center font-mono leading-none tracking-tight text-neutral-250 md:text-2xl lg:text-3xl dark:text-black">
                Come out on top in this fast-paced card game!
            </h1>
            <h1 class="mb-4 text-xl font-semibold flex justify-center font-sans leading-none tracking-tight text-red-500 md:text-xl lg:text-xl dark:text-red-500">
                Play Below
            </h1>
            <div className="flex justify-evenly mb-8">
                <a
                    href="/rules"
                    class="text-white flex-initial bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Learn to Play
                </a>
                <a
                    href="/hub"
                    class="text-white flex-initial bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Join a Game
                </a>
            </div>
        </div>
    );
};

export default Home;
