import React, { useState } from "react";
import { Link, useHistory, useNavigate } from "react-router-dom";
import "../admin-dashboard/admin_dashboard.css";
import myImage from "./images/wheel.jpg";

function Navbar() {
  return (
    <div>
      <nav>
        <div className="logo-container">
          <div className="logo">
            <img className="img" src={myImage} alt="Wheel Image" />
            <h2>HOT_ </h2>
            <h2>WHEELS</h2>
          </div>
        </div>
        <div className="nav-opt">
          <Link to="/admin-dashboard" className="login-btn2" id="back">
            Back
          </Link>
        </div>
      </nav>
      <div></div>
    </div>
  );
}

export default Navbar;
