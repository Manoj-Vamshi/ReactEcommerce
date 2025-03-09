import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Loginpage";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./Userdashboard";
import ProductList from "./ProductList";
import AddressPage from "./adresspage";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from "./StripeCheckoutForm";

const stripePromise = loadStripe('pk_test_51QPSYoFSkIgZioxSuwQgxQzI2IgEhndKETMGQwth38GlsHcbGSMgreOmmMycBs0F2Rp4fcd2D5qwBphJiGBci6Ra00np7Zmfca');
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/AdminDashboard" element={<AdminDashboard />} />
              <Route path="/UserDashboard" element={<UserDashboard />} />
              <Route path="/ProductList" element={<ProductList />} />
              <Route path="/adresspage" element={<AddressPage />} />
              <Route
                path="/StripeCheckoutForm"
                element={
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm />
                  </Elements>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
