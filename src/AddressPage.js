import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./adresspage.css";

function AddressPage() {
  // const location = useLocation();
  const navigate = useNavigate();

  const addressRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);

  // AddressPage.js
  const location = useLocation();
  const { product } = location.state || {};  // Destructure with default empty object

  if (!product) {
    return <div>No product data available. Please go back and try again.</div>;
  }




  const handleSubmit = (event) => {
    event.preventDefault();

    // Get form values using refs
    const address = addressRef.current.value;
    const street = streetRef.current.value;
    const city = cityRef.current.value;
    const state = stateRef.current.value;
    const zip = zipRef.current.value;

    const fullAddress = `${address}, ${street}, ${city}, ${state} - ${zip}`;

    // Navigate to the checkout page with product and address
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
          <input
            type="text"
            id="address"
            ref={addressRef}
            placeholder="Enter your building address"
            required
          />

          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            ref={streetRef}
            placeholder="Enter your street"
            required
          />

          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            ref={cityRef}
            placeholder="Enter your city"
            required
          />

          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            ref={stateRef}
            placeholder="Enter your state"
            required
          />

          <label htmlFor="zip">Zip Code:</label>
          <input
            type="text"
            id="zip"
            ref={zipRef}
            placeholder="Enter your zip code"
            required
          />

          <button type="submit" className="submit-button">
            Proceed to Checkout
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddressPage;
