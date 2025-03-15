import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Use BrowserRouter here
import Login from "./Loginpage";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./Userdashboard";
import AdminProductList from "./AdminProductList";
import AddressPage from "./AddressPage";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from "./StripeCheckoutForm";
import OrdersPage from "./orders";
import UserProductList from "./UserProductList";
import { CartProvider } from "./CartContext";
import CartPage from "./CartPage";

const stripePromise = loadStripe('pk_test_51R1Ay32MerSSQ4SSqbpwei3PorWjxNMBPAse7dt2QTnSSrjfEFotgGYYLb2gbxonZb1UBykpkTAV13JtLmOmvKJm003kSbdxEJ');
function App() {
  return (
    <CartProvider> {/* CartProvider should wrap the entire app */}
      <BrowserRouter> {/* Use BrowserRouter as the root router */}
        <div className="App">
          <header className="App-header">
            <div className="app-container">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route path="/UserDashboard" element={<UserDashboard />} />
                <Route path="/AdminProductList" element={<AdminProductList />} />
                <Route path="/UserProductList" element={<UserProductList />} />
                <Route path="/CartPage" element={<CartPage />} />
                <Route path="/AddressPage" element={<AddressPage />} />
                <Route
                  path="/StripeCheckoutForm"
                  element={
                    <Elements stripe={stripePromise}>
                      <StripeCheckoutForm />
                    </Elements>
                  }
                />
                <Route path="/orders" element={<OrdersPage />} />
              </Routes>
            </div>
          </header>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
