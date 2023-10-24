import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./adminedit.css";
import myImage from "./images/wheel.jpg";

function AdminEdit() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("admin");

  const [admin, setAdmin] = useState({
    username: "",
    password: "",
    profilePicture: "", // Store the image URL
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!adminName) {
      console.error("Admin name not found in localStorage");
      return;
    }

    axios
      .get(`http://localhost:5000/admin-details/${adminName}`)
      .then((response) => {
        setAdmin(response.data);
      })
      .catch((error) => {
        console.error("Error fetching admin details:", error);
      });
  }, [adminName]);

  const handleBack = () => {
    localStorage.removeItem("admin");
    navigate("/admin-dashboard");
  };
  const handleUpdateAdmin = (e) => {
    e.preventDefault();
  
    if (isLoading) {
      return;
    }
  
    setIsLoading(true);
  
    const updatedAdmin = {
      username: admin.username,
      password: admin.password,
      profilePicture: admin.profilePicture, // Include the existing image URL
    };
  
    // Upload the image file to the server
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("username", admin.username); // Include the username in the request body
  
      axios
        .post('http://localhost:5000/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
          },
        })
        .then((response) => {
          // Handle the response, update the admin's profilePicture field, and update the admin profile
          const updatedAdmin = { ...admin, profilePicture: response.data.imageUrl };
          updateAdminProfile(updatedAdmin);
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          setIsLoading(false);
        });
    }
  };
    

  const updateAdminProfile = (updatedAdmin) => {
    axios
      .put(`http://localhost:5000/admin-details/${adminName}`, updatedAdmin)
      .then((response) => {
        alert("Admin profile updated successfully");
        navigate("/admin-profile");
        localStorage.removeItem('admin');
        localStorage.setItem("admin", admin.username);
      })
      .catch((error) => {
        console.error("Error updating admin profile:", error);
        setIsLoading(false);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  return (
    <div>
      <nav>
        {/* ...Your navigation code... */}
      </nav>
      <div className="admin-edit-container">
        <h1 className="admin-edit-heading">Edit Admin Profile</h1>
        <form className="admin-edit-form" onSubmit={handleUpdateAdmin}>
          <div className="form-field">
          <div className="form-field">
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleImageChange}
            />
          </div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={admin.username}
              onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={admin.password}
              onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div className="update-btn-conatiner">
            <button type="submit" className="update-button" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEdit;
