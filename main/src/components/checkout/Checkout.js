import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import myImage from "./images/wheel.jpg";
import "./checkout.css";
import axios from "axios";
// import { useSelector } from "react-router-dom";
function Checkout() {
  const navigate = useNavigate();
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phoneNumber: "",
  });

  const [product, setProduct] = useState(null);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state

  useEffect(() => {
    const productId = localStorage.getItem("selectedProduct");

    if (productId) {
      fetch(`http://localhost:5000/products/${productId}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({
      ...deliveryInfo,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple form submissions while loading

    if (!isTermsAccepted) {
      alert("Please accept the terms to proceed.");
      return;
    }
    setIsLoading(true); // Set loading state when submitting the form

  
    const deliveryData = {
      fullName: deliveryInfo.fullName,
      address: deliveryInfo.address,
      email: deliveryInfo.email,
      city: deliveryInfo.city,
      zipCode: deliveryInfo.zipCode,
      phoneNumber: deliveryInfo.phoneNumber,
    };
    localStorage.setItem("username",deliveryData.fullName);
    localStorage.setItem("email",deliveryData.email);
    localStorage.setItem("deliveryaddress",deliveryInfo.address);
  
    const priceId= product.priceId;
    console.log(priceId);
    if (deliveryData.email) {
      // Make an API request to create a Stripe session
      try {
        const response = await axios.post("http://localhost:5000/create-checkout-session", {
          product: product, 
          priceId: priceId, 
          quantity: 1,
        });
        
  
        // Redirect to the Stripe checkout session URL
        window.location.href = response.data.url;
      } catch (error) {
        console.error("Error creating Stripe session:", error);
      } finally {
        setIsLoading(false); // Reset loading state after API request
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };
  
  
  const handleback = () => {
    localStorage.clear();
    window.location.href = "/user-dashboard";
  };

  const buttonStyle = isTermsAccepted ? { backgroundColor: "#00cc00" } : {};

  
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
          <button className="login-btn2" onClick={handleback}>
            Back
          </button>
        </div>
      </nav>

      <div class="container">
        <div className="product-details1">
          {product && (
            <div>
              <h2>Product Details</h2>
              <h1>{product.name}</h1>
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
              />
              <h3 className="description">{product.description}</h3>
              <h3 className="price">Price: ${product.price}</h3>
            </div>
          )}
        </div>

        <div className="checkout-form1">
          <div className="del-form">
            <h2>Delivery Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={deliveryInfo.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={deliveryInfo.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={deliveryInfo.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="zipCode">ZIP Code:</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={deliveryInfo.zipCode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={deliveryInfo.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    name="condition "
                    checked={isTermsAccepted}
                    onChange={handleCheckboxChange}
                  />
                  <span>Confirm the order</span>
                </label>
              </div>
              
              <button
            type="submit"
            className="submit-button1"
            style={buttonStyle}
            disabled={!isTermsAccepted || isLoading} // Disable when loading
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
