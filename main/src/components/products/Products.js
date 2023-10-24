import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./products.css";
import myImage from "./images/wheel.jpg";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);

  
  const handleEditProduct = (productId) => {
    localStorage.setItem("productId", productId);
    navigate(`/edit`);
  };

  const deleteProduct = (productId) => {
    axios
      .delete(`http://localhost:5000/products/${productId}`)
      .then((response) => {
        toast.success("Product deleted successfully");
        fetchProducts();
      })
      .catch((error) => {
        toast.error("Error deleting product: " + error);
      });
  };

  const fetchProducts = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const filtered = products
      .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const priceA = a.price;
        const priceB = b.price;
        if (sortOrder === "asc") {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, []);

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

      <div className="product-list">
        <h1 className="main-h1">Available Items</h1>
        <div className="search-and-sort">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </label>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <div className="card-container">
                {filteredProducts.map((product) => (
                  <div className="product-card" key={product._id}>
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                    />
                    <div className="product-details">
                      <h4>{product.name}</h4>
                      <p className="description">{product.description}</p>
                      <p className="price">Price: {product.price}/-</p>
                      <p className="quantity">Available Quantity: {product.quantity}</p>
                      <p className="priceId">Price ID: {product.priceId}</p>
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this product?")) {
                            deleteProduct(product._id);
                          }
                        }}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Products;
