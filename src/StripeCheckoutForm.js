import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, push } from "firebase/database";
import { auth } from './firebase';
import "./stripecheckoutform.css";

const StripeCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { cart, address } = location.state || {};

  useEffect(() => {
    if (cart && address) {
      console.log('Cart:', cart);
      console.log('Address:', address);
    }
  }, [cart, address]);

  if (!cart || cart.length === 0 || !address) {
    return <div>Error: Missing cart or address details. Please go back and try again.</div>;
  }

  // ✅ Fix: Correct total amount calculation
  const totalAmountInCents = cart.reduce((total, item) => {
    const priceInDollars = parseFloat(item.price.replace(/[^\d.]/g, ''));

    if (isNaN(priceInDollars)) {
      console.error(`Invalid price for item: ${item.name}`, item.price);
      return total; // Skip invalid prices
    }

    return total + Math.round(priceInDollars * 100) * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      console.log('Total amount being sent to backend (in cents):', totalAmountInCents);

      const { data: { clientSecret } } = await axios.post('http://localhost:4000/create-payment-intent', {
        amount: totalAmountInCents,
      });

      console.log('Received clientSecret:', clientSecret);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(`Payment failed: ${result.error.message}`);
        setMessage('');
      } else if (result.paymentIntent.status === 'succeeded') {
        setMessage('Payment successful!');
        setError('');

        const db = getDatabase();
        const ordersRef = ref(db, 'orders');

        cart.forEach((item) => {
          const newOrderRef = push(ordersRef);
          set(newOrderRef, {
            userId: auth.currentUser?.uid,
            productName: item.name,
            productPrice: item.price,
            productQuantity: item.quantity,
            productImage: item.image,
            shippingAddress: address,
            date: new Date().toISOString(),
          }).then(() => {
            console.log('Order saved successfully for:', item.name);
          }).catch((error) => {
            console.error('Error saving order:', error);
          });
        });

        navigate("/orders");
      }
    } catch (err) {
      console.error('Error during payment:', err);
      setError(`Error: ${err.message}`);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form">
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
      <div className="checkout-form-container">
        <form onSubmit={handleSubmit}>
          <h1>Complete your Payment</h1>

          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p><strong>Product:</strong> {item.name} (x{item.quantity})</p>
              <p><strong>Price:</strong> {item.price} each</p>
            </div>
          ))}

          <p><strong>Total Price:</strong> ${(totalAmountInCents / 100).toFixed(2)}</p>
          <p><strong>Shipping Address:</strong> {address}</p>

          <CardElement />

          <button type="submit" className="stripe-button" disabled={!stripe || loading}>
            {loading ? 'Processing...' : `Pay $${(totalAmountInCents / 100).toFixed(2)}`}
          </button>

          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default StripeCheckoutForm;
