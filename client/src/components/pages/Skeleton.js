import React from "react";

import "../../utilities.css";
import "./Skeleton.css";
import "../modules/NavBar.js";
import logo from "../../corgi.jpg";

const Skeleton = () => {
  return (
    <div className="content-center">
      <img src={logo} />
    </div>
  );
};

export default Skeleton;
