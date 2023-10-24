import React, { useEffect, useState } from "react";
import myImage from "./images/wheel.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./cart.css";

function Cart() {
  const username = localStorage.getItem("username");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/cart/${username}`)
      .then((response) => {
        setBookings(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
      });
  }, [username]);

  const cancelBooking = async (booking) => {
    try {
      const response = await axios.post("http://localhost:5000/cancellation-requests", {
        paymentIntentId: booking.paymentIntentId,
        price: booking.price,
        userName: username,
      });

      if (response.data.success) {
        toast.success("Request for order cancellation sent successfully", {
          autoClose: 2000, // Close the toast after 2 seconds
        });
        // Optionally, you can handle further actions after successful cancellation
        window.location.reload(); // Reload the page to reflect changes
      } else {
        toast.error("Error canceling the booking");
      }
    } catch (error) {
      toast.error("Booking request already in the queue.");
      console.error("Error canceling booking:", error);
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
      <div className="profile-container">
        <h2>Bookings for {username}</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="container1">
            {bookings.length === 0 ? (
              <p>No bookings available</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Shipping Address</th>
                    <th>Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={index}>
                      <td>{booking.productName}</td>
                      <td>{booking.price}</td>
                      <td>{booking.shippingAddress}</td>
                      <td>
                        <button
                          className="cancel"
                          onClick={() => cancelBooking(booking)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Cart;
