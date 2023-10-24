import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import './verify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Verify() {
  const navigate = useNavigate();
  const expectedOTP = localStorage.getItem('phoneOTP');
  const userName = localStorage.getItem('userName');
  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');
  const phone = localStorage.getItem('phone');
  const state = localStorage.getItem('state');
  const country = localStorage.getItem('country');
  const pincode = localStorage.getItem('pincode');

  const [enteredOTP, setEnteredOTP] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const userDetails = {
    username: userName,
    email: email,
    password: password,
    phone: phone,
    state: state,
    pincode: pincode,
    country: country,
  };

  const verifyOTP = () => {
    setLoading(true); // Set loading to true when OTP verification starts

    if (enteredOTP === expectedOTP) {
      axios.post('http://localhost:5000/register', userDetails)
        .then(response => {
          setLoading(false); // Set loading to false when OTP verification is complete

          if (response.data.message) {
            setVerificationStatus('Verification successful. You are registered.');
            alert("User registered successfully..!")
            navigate('/user-login');
            localStorage.clear();
          } else {
            setVerificationStatus('Verification failed. Please try again.');
          } 
        })
        .catch(error => {
          setLoading(false); // Set loading to false on error
          setVerificationStatus('Phone number already exists.');
        });
    } else {
      setLoading(false); // Set loading to false on OTP mismatch
      setVerificationStatus('Verification failed. OTPs do not match.');
    }
  }
  
  return (
    <div>
      <Navbar />
      <div className="otp-verification">
        <div className="otp-card">
          <h2>Enter your OTP here</h2>
          <input
            type="text"
            id="otp"
            value={enteredOTP}
            onChange={(e) => setEnteredOTP(e.target.value)}
          />
          <button onClick={verifyOTP} className="back1">
            Verify
          </button>
        </div>
        {loading ? (
          <p>Loading...</p> // Display a loading message or spinner
        ) : (
          <p>{verificationStatus}</p>
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
    </div>
  );
}

export default Verify;
