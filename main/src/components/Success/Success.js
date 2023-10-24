import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import myImage from "./images/wheel.jpg";
import "./success.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Success() {
  const stripePromise = loadStripe(
    "pk_test_51O1DHFSENxkdHNp7iiyLNC7ujYsTUbzuHfz98xT06zkRssmqUo8V0hHs768kPSNPbQgU2xPhmhsYSxKVOIkDiQJe005NtWyU5T" // Replace with your Stripe publishable key
  );
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get("session_id");

  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [productData, setProductData] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [isSavingData, setIsSavingData] = useState(false);

  const handleHome = () => {
    localStorage.clear();
    navigate("/user-dashboard");
  };

  const handleCapturePaymentIntent = async () => {
    const stripe = await stripePromise;

    console.log(session_id);

    const { paymentIntent, error } = await stripe.retrievePaymentIntent(
      session_id
    );

    if (error) {
      console.error("Error retrieving Payment Intent:", error);
    } else {
      const paymentIntentId = paymentIntent.id;
      console.log("Payment Intent ID:", paymentIntentId);
    }
  };

  const email = localStorage.getItem("email");
  const name = localStorage.getItem("username");
  useEffect(() => {
    if (!emailSent) {
      emailjs.init("sPHXsF3fC9Q-ykAzo");

      const emailParams = {
        to_email: email,
        to_name: name,
        from_name: "HOT_Wheels",
        message: "Your order has been placed successfully.",
      };

      emailjs
        .send("service_amxvq5x", "template_ao5cfyh", emailParams)
        .then(
          (response) => {
            console.log("Email sent successfully", response);
            toast.success("Email sent successfully!");
            setEmailSent(true);
          },
          (error) => {
            console.error("Email sending failed", error);
            toast.error("Error sending email.");
          }
        );
    }
  }, [email, name, emailSent]);

  useEffect(() => {
    const selectedProductId = localStorage.getItem("selectedProduct");

    axios
      .get(`http://localhost:5000/products/${selectedProductId}`)
      .then((response) => {
        const productData = response.data;
        setProductData(productData);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, []);

  useEffect(() => {
    if (session_id) {
      axios
        .get(`http://localhost:5000/get-payment-intent/${session_id}`)
        .then((response) => {
          const paymentIntentId = response.data.paymentIntentId;
          setPaymentIntentId(paymentIntentId);
          console.log("Fetched Payment Intent ID:", paymentIntentId);
        })
        .catch((error) => {
          console.error("Error fetching Payment Intent ID:", error);
        });
    }
  }, [session_id]);
 // Use toast.success and toast.error to display success or error messages
 const saveData = () => {
  if (productData) {
    setIsSavingData(true);

    const productDetails = {
      productId: localStorage.getItem("selectedProduct"),
      productName: productData.name,
      price: productData.price,
      userName: name,
      paymentIntentId: paymentIntentId,
      shippingAddress: localStorage.getItem("deliveryaddress"),
    };

    axios
      .post("http://localhost:5000/new-booking", productDetails)
      .then((response) => {
        console.log("Booking response:", response.data);
        setIsDataSaved(true);

        toast.success("Data is saved successfully!");

        setTimeout(() => {
          navigate("/user-dashboard");
        }, 2000); // Wait for 2 seconds before navigating
      })
      .catch((error) => {
        console.error("Error booking item:", error);
        toast.error("Failed to save data. Please try again.");
      })
      .finally(() => {
        setIsSavingData(false);
      });
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
          <Link to="/user-dashboard" className="login-btn2" id="back">
            Back
          </Link>
        </div>
      </nav>

      <div className="custom-shape-divider-top-1697578780">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* ... existing SVG path for top divider */}
        </svg>
      </div>
      <div className="message-box">
        <h1>
          Success! Your order has been placed.
          <br />
          An email that contains order details has been sent.
        </h1>
        <button
          className="save-button"
          onClick={saveData}
          disabled={isSavingData}
        >
          {isSavingData ? "Saving..." : "Save Data"}
        </button>
        {isDataSaved && <p>Data is saved successfully!</p>}
      </div>
      <div className="custom-shape-divider-bottom-1697579167">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* ... existing SVG path for bottom divider */}
        </svg>
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

export default Success;
