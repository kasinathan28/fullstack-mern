import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Payments from "./Payments"; // Import your Payments component here

const stripePromise = loadStripe("sk_test_51O1DHFSENxkdHNp7UIpMFr6JFZF1OVYrY60cdGCby6oe2DZeJKEjEEmz0YzzNALoLXrKKEdUuGhsY2Z7M3wiH1cj00iivjlrVM");

function App() {
  return (
    <div className="App">
      <Router>
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </Elements>
      </Router>
    </div>
  );
}

export default App;
