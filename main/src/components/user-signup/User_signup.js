import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import myImage from "./images/wheel.jpg";
import "./user_signup.css";

function User_signup() {
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    state: "",
    pincode: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateOTP = (limit) => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < limit; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      alert("Phone number is required");
      return;
    }
    try {
      setLoading(true); // Set loading to true when sending OTP
      // Make a POST request to the /sendOTP API
      const response = await axios.post("http://localhost:5000/sendOTP", {
        phoneNumber: formData.phone,
      });

      if (response.data.success) {
        const generatedOTP = response.data.otp;
        setGeneratedOTP(generatedOTP);
        localStorage.setItem("phoneOTP", generatedOTP);
        navigate("/verify");
      } else {
        console.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false); // Set loading to false after sending OTP
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting the form
    localStorage.setItem("userName", formData.username);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("password", formData.password);
    localStorage.setItem("phone", formData.phone);
    localStorage.setItem("state", formData.state);
    localStorage.setItem("pincode", formData.pincode);
    localStorage.setItem("country", formData.country);

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;

    if (!passwordRegex.test(formData.password)) {
      alert("Password must contain at least 8 characters, 1 capital letter, 1 number, and 1 special symbol.");
      setLoading(false); // Set loading to false
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please re-enter your password.");
      setLoading(false); // Set loading to false
      return;
    }

    sendOTP();
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
          <Link to="/user-login" className="text">
            <button className="login-btn2" id="login">
              Login
            </button>
          </Link>
        </div>
      </nav>
      <div className="background-container"></div>
      <div className="div1">
        <div>
          <h2>User Signup</h2>
        </div>
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="field-container">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="field-container">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select a country</option>
              <option value="India">India</option>
            </select>
          </div>
          <div className="field-container">
            <label htmlFor="state">State:</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            >
              <option value="">Select a state</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
          <div className="field-container">
            <label htmlFor="pincode">Pincode:</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
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
          <div className="field-container">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <p>
            Already have an account <Link to="/user-login">Login</Link>
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
    </div>
  );
}

export default User_signup;
