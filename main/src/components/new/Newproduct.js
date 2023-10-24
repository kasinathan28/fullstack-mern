import React, { useState } from "react";
import { Link } from "react-router-dom";
import myImage from "./images/wheel.jpg";
import "./newproduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Newproduct() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    quantity: "",
    priceId: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const [selectedFileName, setSelectedFileName] = useState(null);
  const [fileChosen, setFileChosen] = useState(false);

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setProductData({
      ...productData,
      image: selectedImage,
    });
    setSelectedFileName(selectedImage.name);
    setFileChosen(true);
  };

  const handleSaveProduct = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("quantity", productData.quantity);
      formData.append("image", productData.image);
      formData.append("priceId", productData.priceId);

      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        toast.success("Product created successfully."); // Show success toast
        console.log("Product created successfully.");
        setProductData({
          name: "",
          description: "",
          price: "",
          image: null,
          quantity: "",
          priceId: "",
        });
        setSelectedFileName(null);
        setFileChosen(false);
      } else {
        toast.error("Failed to create product."); // Show error toast
        console.error("Failed to create product.");
      }
    } catch (error) {
      toast.error("An error occurred: " + error); // Show error toast
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
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
          <Link to="/admin-dashboard">
            <button className="login-btn2">BACK</button>
          </Link>
        </div>
      </nav>

      <div className="create-product">
        <h2>Create New Product</h2>
        <div className="form-container5">
          <div className="form-field">
            <label htmlFor="name">Product Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Product Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="price">Product Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="priceId">PriceId:</label>
            <input
              type="String"
              id="priceId"
              name="priceId"
              value={productData.priceId}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="image">Upload Image:</label>
            <div className="custom-file-input">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  handleImageUpload(e);
                  setSelectedFileName(e.target.files[0].name);
                  setFileChosen(true);
                }}
              />
              <label
                htmlFor="image"
                className={`file-input-button ${
                  fileChosen ? "green-button" : ""
                }`}>
                {selectedFileName ? selectedFileName : "Choose File"}
              </label>
            </div>
          </div>
          <button className="save-btn" onClick={handleSaveProduct} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Newproduct;
