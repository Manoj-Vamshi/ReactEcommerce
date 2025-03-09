import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./adresspage.css";

function AddressPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state;

  const handleSubmit = (event) => {
    event.preventDefault();
    const address = document.getElementById("address").value;
    const street = document.getElementById("street").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;

    const fullAddress = `${address}, ${street}, ${city}, ${state} - ${zip}`;
    navigate("/StripeCheckoutForm", { state: { product, address: fullAddress } });
  };

  return (
    <div className="address-page">

      <div className="address-container">
        <h1>Enter Delivery Address</h1>
        <div className="product-info">
          <img src={product.image} alt={product.name} className="product-image" />
          <p><strong>Product:</strong> {product.name}</p>
          <p><strong>Price:</strong> {product.price}</p>
        </div>

        <form className="address-form" onSubmit={handleSubmit}>
          <label htmlFor="address">Building:</label>
          <input type="text" id="address" placeholder="Enter your building address" required />

          <label htmlFor="street">Street:</label>
          <input type="text" id="street" placeholder="Enter your street" required />

          <label htmlFor="city">City:</label>
          <input type="text" id="city" placeholder="Enter your city" required />

          <label htmlFor="state">State:</label>
          <input type="text" id="state" placeholder="Enter your state" required />

          <label htmlFor="zip">Zip Code:</label>
          <input type="text" id="zip" placeholder="Enter your zip code" required />

          <button type="submit" className="submit-button">Proceed to Checkout</button>
        </form>
      </div>
    </div>
  );
}

export default AddressPage;
