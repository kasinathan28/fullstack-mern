import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myImage from "./images/wheel.jpg";
import "./user_login.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function User_login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const apiUrl = "http://localhost:5000/login";
  
    try {
      const response = await axios.post(apiUrl, formData);
  
      if (response.data.message === "Login successful") {
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 2000); // Wait for 2 seconds before navigating
      } else {
        toast.error("Login failed.");
      }
    } catch (error) {
      console.error("Login failed. Internal server Error", error);
      toast.error("Login failed.");
    }
  };
  
  
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
          <Link to="/" className="login-btn2" id="signup">
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="div1">
        <div>
          <h2>User Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field-container">
            <label htmlFor="email"> Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="field-container">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}{/* Conditionally set button text */}
          </button>
          <p>
            Don't have an account? <Link to="/">Register</Link>
          </p>
          <p>
            If you are an admin. <Link to="/admin-login">Login here</Link>
          </p>
        </form>
      </div>
      <div className="custom-shape-divider-bottom-1697579167">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <ToastContainer />
    </div>
  );
}

export default User_login;
