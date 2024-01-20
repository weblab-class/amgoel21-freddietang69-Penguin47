import React from "react";

import "./Home.css";
import logo from "../../corgi.jpg";

const Home = () => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <img src={logo} />
      </div>
      <div className="flex items-stretch">
        <div className="text-white flex-1">some text</div>
        <div className="text-white flex-1">some more text</div>
      </div>
    </div>
  );
};

export default Home;
