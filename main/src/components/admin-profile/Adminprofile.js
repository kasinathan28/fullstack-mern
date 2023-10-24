import React, { useState, useEffect } from "react";
import myImage from "./images/wheel.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin-profile.css";
import { toast } from "react-toastify";

function AdminProfile() {
  const [adminDetails, setAdminDetails] = useState(null);
  const admin = localStorage.getItem("admin");
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/admin-edit");
  };

  useEffect(() => {
    // Fetch admin details when the component mounts
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin-details/${admin}`
      );
      setAdminDetails(response.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  return (
    <div>
      <nav className="navbar">
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

      <div className="admin-details-card">
        {adminDetails ? (
          <div>
            <div className="profile-bg">
              <div className="profile-picture">
                <img src={adminDetails.image} alt="Profile" />
              </div>
            </div>

            <div className="field-container">
              <label className="left margin">
                Name: {adminDetails.username}
              </label>
            </div>
            <div className="field-container">
              <label className="left">Password: {adminDetails.password}</label>
            </div>
            <div className="button-container">
              <button className="edit-button" onClick={handleEdit}>
                Edit
              </button>
            </div>
          </div>
        ) : (
          <p>Loading admin details...</p>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;
