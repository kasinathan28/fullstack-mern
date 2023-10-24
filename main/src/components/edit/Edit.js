import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./edit.css";
import myImage from "./images/wheel.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Edit() {
  const navigate = useNavigate();
  const productId = localStorage.getItem("productId");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    priceId: "",
    quantity: 0,
  });
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state

  useEffect(() => {
    if (!productId) {
      console.error("Product ID not found in localStorage");
      return;
    }

    axios
      .get(`http://localhost:5000/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [productId]);

  const handleBack = () => {
    localStorage.removeItem("productId");
    navigate("/products");
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();

    if (isLoading) {
      return; // Prevent multiple submissions while loading
    }

    setIsLoading(true); // Set loading state when updating the product

    const updatedProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      priceId: product.priceId,
      quantity: product.quantity,
    };

    axios
      .put(`http://localhost:5000/products/${productId}`, updatedProduct)
      .then((response) => {
        toast.success("Product updated successfully");

        setTimeout(() => {
          // Delay the navigation by 1 second (1000 milliseconds)
          navigate("/products");
        }, 1000);
      })
      .catch((error) => {
        toast.error("Error updating product: " + error); // Show error toast
        console.error("Error updating product:", error);
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state after the API request
      });
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
          <Link to="/products">
            <button className="login-btn2" onClick={handleBack}>
              Back
            </button>
          </Link>
        </div>
      </nav>
      <div className="edit-product-container">
        <h1 className="edit-product-heading">Edit Product</h1>
        <form className="edit-product-form" onSubmit={handleUpdateProduct}>
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="input-field"
            />
          </div>
          <div className="form-field">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              className="input-field"
            />
          </div>
          <div className="form-field">
            <label htmlFor="priceId">PriceId:</label>
            <input
              type="String"
              id="priceId"
              name="priceId"
              value={product.priceId}
              onChange={(e) =>
                setProduct({ ...product, priceId: e.target.value })
              }
              className="input-field"
            />
          </div>
          <div className="form-field">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={(e) =>
                setProduct({ ...product, quantity: e.target.value })
              }
              className="input-field"
            />
          </div>
          <button type="submit" className="update-button" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Edit;
