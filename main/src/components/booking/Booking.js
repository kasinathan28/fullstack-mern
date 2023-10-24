import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './booking.css'; // Import the CSS file
import axios from 'axios';

function Booking() {
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    // Make an API request to your backend to fetch booking data using Axios
    axios.get('http://localhost:5000/bookings') // Replace with your actual API endpoint
      .then((response) => {
        setBookingData(response.data);
        setIsLoading(false); // Update loading state when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching booking data:', error);
        setIsLoading(false); // Update loading state on error
      });
  }, []);

  const handleDelete = (bookingId) => {
    // Make a DELETE request to the API to delete the booking
    axios.delete(`http://localhost:5000/delete-booking/${bookingId}`)
      .then((response) => {
        console.log('Booking deleted successfully:', response.data);
        // Refresh the page after successful deletion
        window.location.reload();
        // You can also update the bookingData state to reflect the changes if needed
      })
      .catch((error) => {
        console.error('Error deleting booking:', error);
        // Handle errors if the deletion fails
      });
  }

  return (
    <div>
      <Navbar />
      <h2>Booking Details</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="container1">
          {bookingData.length === 0 ? ( // Conditionally render "No bookings found" message
            <p>No bookings found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Product Id</th>
                  <th>User Name</th>
                  <th>Shipping Address</th>
                  <th>Payment Intent Id</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {bookingData.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.productName}</td>
                    <td>{booking.price}/-</td>
                    <td>{booking.productId}</td>
                    <td>{booking.userName}</td>
                    <td>{booking.shippingAddress}</td>
                    <td>{booking.paymentIntentId}</td>
                    <td>
                      <button className='del-btn' onClick={() => handleDelete(booking._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Booking;
