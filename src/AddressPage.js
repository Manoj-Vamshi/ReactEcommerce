import React, { useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./adresspage.css";

function AddressPage() {
  const navigate = useNavigate();
  const addressRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);


  const location = useLocation();
  const cart = location.state?.cart || JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    return <div>No cart items available. Please go back and try again.</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const address = addressRef.current.value;
    const street = streetRef.current.value;
    const city = cityRef.current.value;
    const state = stateRef.current.value;
    const zip = zipRef.current.value;

    const fullAddress = `${address}, ${street}, ${city}, ${state} - ${zip}`;

    navigate("/StripeCheckoutForm", { state: { cart, address: fullAddress } });
  };

  return (
    <div className="address-page">
      <aside>
        <ul>
          <li>
            <Link to="/UserDashboard">Home</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/UserProductList">Products</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/CartPage">Cart</Link>
          </li>
        </ul>
        <ul>
          <li> <Link to="/orders">Orders</Link></li>
        </ul>
        <ul>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </aside>
      <div className="address-container">
        <h1>Enter Delivery Address</h1>

        <div className="cart-products-container">
          {cart.map((product, index) => (
            <div key={index} className="product-info">
              <img src={product.image} alt={product.name} className="product-image" />
              <p><strong>Product:</strong> {product.name}</p>
              <p><strong>Price:</strong> ${product.price} x {product.quantity} = ${product.price * product.quantity}</p>
            </div>
          ))}
          </div>
          <div className="total-price"><h2>Total: ${cart.reduce((total, item) => total + parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity, 0).toFixed(2)}</h2>
          </div>


        <form className="address-form" onSubmit={handleSubmit}>
          <label htmlFor="address">Building:</label>
          <input type="text" id="address" ref={addressRef} placeholder="Enter your building address" required />

          <label htmlFor="street">Street:</label>
          <input type="text" id="street" ref={streetRef} placeholder="Enter your street" required />

          <label htmlFor="city">City:</label>
          <input type="text" id="city" ref={cityRef} placeholder="Enter your city" required />

          <label htmlFor="state">State:</label>
          <input type="text" id="state" ref={stateRef} placeholder="Enter your state" required />

          <label htmlFor="zip">Zip Code:</label>
          <input type="text" id="zip" ref={zipRef} placeholder="Enter your zip code" required />

          <button type="submit" className="submit-button">
            Proceed to Checkout
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddressPage;