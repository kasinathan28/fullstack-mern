import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./admin_dashboard.css";
import myImage from "./images/wheel.jpg";

function Admin_dash() {
  // Define isLoggedIn state and initialize it based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const handleLogout = () => {
    localStorage.removeItem("admin");
    // Clear the user's authentication state and data
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
  };

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after a delay (simulating data loading)
    }, 500); // Adjust the delay as needed
  }, []);

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
          <Link
            to="/"
            className="login-btn2"
            id="signup"
            onClick={handleLogout}
          >
            Logout
          </Link>
        </div>
      </nav>
      <div className="sidebar">
      <div className="sidebaropt">
          <div className="sidebar1">
            <Link to="/admin-profile" className="booking-text">
              <p className="h2">My Profile</p>
            </Link>
          </div>
        </div>
        <div className="sidebaropt">
          <div className="sidebar1">
            <Link to="/booking" className="booking-text">
              <p className="h2">Bookings</p>
            </Link>
          </div>
        </div>
        <div className="sidebaropt">
          <div className="sidebar1">
            <Link to="/products" className="booking-text">
              <p className="h2">Available items</p>
            </Link>
          </div>
        </div>
        <div className="sidebaropt">
          <div className="sidebar1">
            <Link to="/users" className="booking-text">
              <p className="h2">Users</p>
            </Link>
          </div>
        </div>
        <div className="sidebaropt">
          <div className="sidebar1">
            <Link to="/cancellations" className="booking-text">
              <p className="h2">Cancellations</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="main">
        {isLoading ? (
          // Show a loading indicator while data is being fetched
          <div className="loading-indicator">Loading...</div>
        ) : (
          // Render your content once loading is complete
          <div className="cards-container2">
            <div className="card">
              <div className="card-content">
                <h3>Add new </h3>
                <p>
                  Image
                  <br />
                  Description
                  <br />
                  Price
                  <br />
                  Image
                </p>
                <Link to="/newproduct">
                  <button className="buy-now">New</button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin_dash;
