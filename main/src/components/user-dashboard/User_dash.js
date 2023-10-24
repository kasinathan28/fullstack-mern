import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./user_dashboard.css";
import myImage from "./images/wheel.jpg";

function User_dash() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const fetchProducts = () => {
    fetch("http://localhost:5000/products-user")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false); // Set loading to false once data is loaded
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false if there's an error
      });
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleBuyClick = (productId) => {
    localStorage.setItem("selectedProduct", productId);
  };

  const renderProductCards = () => {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    const sortFunction =
      sortOption === "price-low-to-high"
        ? (a, b) => a.price - b.price
        : sortOption === "price-high-to-low"
        ? (a, b) => b.price - a.price
        : null;

    if (sortFunction) {
      filteredProducts.sort(sortFunction);
    }

    return filteredProducts.map((product) => (
      <div className="product-card" key={product._id}>
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
        />
        <div className="product-details">
          <h4>{product.name}</h4>
          <p className="description">{product.description}</p>
          <p className="price">Price: {product.price}/-</p>
          <p className="quantity">Quantity: {product.quantity}</p>

          <Link
            to="/checkout"
            className="buy-button"
            onClick={() => handleBuyClick(product._id)}
          >
            Buy
          </Link>
        </div>
      </div>
    ));
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
          <button className="login-btn2" onClick={toggleDropdown}>
            Menu
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/cart" className="dropdown-item">
                Cart
              </Link>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {loading && <div>Loading...</div>} {/* Loading indicator */}
      <div className="product-container">
        <h1>Available Items</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search"
        />
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="default">Sort by</option>
          <option value="price-low-to-high">Price: Low to High</option>
          <option value="price-high-to-low">Price: High to Low</option>
        </select>

        <div className="product-cards-container">{renderProductCards()}</div>
      </div>
    </div>
  );
}

export default User_dash;
