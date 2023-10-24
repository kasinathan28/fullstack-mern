import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


import Admin_dash from "../src/components/admin-dashboard/Admin_dash";
import Admin_login from "../src/components/admin-login/Admin_login";
import User_dash from "../src/components/user-dashboard/User_dash";
import User_signup from "../src/components/user-signup/User_signup";
import User_login from "../src/components/user-login/User_login";
import Booking from "../src/components/booking/Booking";
import Products from "./components/products/Products";
import Newproduct from "./components/new/Newproduct";
import Edit from "./components/edit/Edit";
import Checkout from "./components/checkout/Checkout";
import Success from "./components/Success/Success";
import Navbar from "./components/Navbar/Navbar";
import Verify from "./components/verify/Verify";
import Cart from "./components/cart/Cart";
import Cancellation from "./components/cancellations/Cancellation";
import Users from "./components/users/Users";
import Adminprofile from "./components/admin-profile/Adminprofile";
import Adminedit from "./components/admin-edit/Adminedit";

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={<User_signup />} />
            <Route path="/admin-dashboard" element={<Admin_dash />} />
            <Route path="/admin-login" element={<Admin_login />} />
            <Route path="/user-dashboard" element={<User_dash />} />
            <Route path="/user-login" element={<User_login />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/products" element={<Products />} />
            <Route path="/newproduct" element={<Newproduct />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success/>}/>
            <Route path="navbar" element={<Navbar/>}/>
            <Route path="/verify" element={<Verify/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/cancellations" element={<Cancellation/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/admin-profile" element={<Adminprofile/>}/>
            <Route path="/admin-edit" element={<Adminedit/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
