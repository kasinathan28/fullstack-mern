import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin_login.css";
import myImage from "./images/wheel.jpg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "./images/bg.jpg";
function Admin_Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading state when the form is submitted

    try {
      const response = await axios.post(
        "http://localhost:5000/admin-login",
        formData
      );

      if (response.data.success) {
        // Admin login is successful
        toast.success("Login successful", {
          onClose: () => {
            setIsLoading(false); // Set loading state to false after handling the login

            // Use setTimeout to delay the navigation after showing the success toast
            setTimeout(() => {
              navigate("/admin-dashboard"); // Navigate to admin-dashboard after a delay
            }, 2000); // Adjust the delay time (in milliseconds) as needed
          },
        });
        localStorage.setItem("admin", formData.username);
      } else {
        toast.error("Invalid Username or Password", {
          onClose: () => {
            setIsLoading(false); // Set loading state to false after handling the login
          },
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login", {
        onClose: () => {
          setIsLoading(false); // Set loading state to false after handling the login
        },
      });
    }
  };

  // Add a state variable to track the success toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Use a useEffect to navigate after the success toast is closed
  useEffect(() => {
    if (showSuccessToast) {
      navigate("/admin-dashboard"); // Navigate to admin-dashboard after the success toast is displayed and closed
    }
  }, [showSuccessToast]);

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
          <Link to="/" className="login-btn2" id="back">
            Back
          </Link>
        </div>
      </nav>
      <div className="div1">
        <div>
          <h2>Admin Login</h2>
        </div>
        {isLoading ? (
          <div className="loading-indicator">Logging in...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field-container">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
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
            <button type="submit" className="submit-btn">
              Login
            </button>
            <p>
              If you are a User. <Link to="/user-login">Login here</Link>{" "}
            </p>
          </form>
        )}
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

export default Admin_Login;
