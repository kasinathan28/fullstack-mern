import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import myImage from "./images/wheel.jpg";
import "./users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users

  useEffect(() => {
    // Make an API request to your backend to fetch user data using Axios
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter users based on the search term
    const filtered = users.filter((user) =>
      user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

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

      <div className="user-list">
        <h1 className="main-h1">User List</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <p className="no-user-found">No user found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Slno:</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                {/* Add more user attributes as needed */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Users;
