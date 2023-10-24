import React, { useEffect, useState } from "react";
import myImage from "./images/wheel.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./cancellation.css";

function Cancellation() {
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/cancellation-requests")
      .then((response) => {
        setCancellationRequests(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cancellation requests:", error);
        setIsLoading(false);
      });
  }, []);

  const handleAcceptCancellation = async (paymentIntentId) => {
    setAcceptLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/cancel-booking/${paymentIntentId}`
      );

      if (response.data.message === "Order canceled and refunded successfully") {
        // Successfully accepted the cancellation request
        toast.success("Cancellation request accepted");
        window.location.reload();
      } else {
        toast.error("Error accepting the cancellation request");
      }
    } catch (error) {
      toast.error("Error accepting the cancellation request",error);
      console.error("Error accepting cancellation:", error);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDeclineCancellation = async (paymentIntentId) => {
    setDeclineLoading(true);
  
    try {
      const response = await axios.post(
        `http://localhost:5000/decline-cancellation`,
        {
          paymentIntentId,
        }
      );
  
      if (response.data.success) {
        toast.success("Cancellation request declined", {
          onClose: () => {
            setTimeout(() => {
              window.location.reload();
            }, 2000); // Refresh the window after 2 seconds
          },
        });
      } else {
        toast.error("Error declining the cancellation request");
      }
    } catch (error) {
      toast.error("Error declining the cancellation request");
      console.error("Error declining cancellation:", error);
    } finally {
      setDeclineLoading(false);
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
          <Link to="/admin-dashboard" className="login-btn2" id="back">
            Back
          </Link>
        </div>
      </nav>
      <h1> Cancellation Request</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="container1">
          <table>
            <thead>
              <tr>
                <th>Payment Intent ID</th>
                <th>Price</th>
                <th>User Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cancellationRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.paymentIntentId}</td>
                  <td>{request.price}</td>
                  <td>{request.userName}</td>
                  <td>
                    <button
                      className="accept"
                      onClick={() => handleAcceptCancellation(request.paymentIntentId)}
                      disabled={acceptLoading}
                    >
                      {acceptLoading ? "Accepting..." : "Accept"}
                    </button>
                    <button
                      className="decline"
                      onClick={() => handleDeclineCancellation(request.paymentIntentId)}
                      disabled={declineLoading}
                    >
                      {declineLoading ? "Declining..." : "Decline"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Cancellation;
