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

  // Safely destructure product and address from location.state
  const { product, address } = location.state || {};

  useEffect(() => {
    if (product && address) {
      console.log('Product:', product);
      console.log('Address:', address);
    }
  }, [product, address]);

  // Check if product and address exist, if not display error
  if (!product || !address) {
    return <div>Error: Missing product or address details. Please go back and try again.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Convert price to cents
      const amountInCents = parseFloat(product.price.replace('$', '').replace(',', '')) * 100;

      console.log('Amount being sent to backend (in cents):', amountInCents);

      // Send request to backend to create payment intent
      const { data: { clientSecret } } = await axios.post('http://localhost:4000/create-payment-intent', {
        amount: amountInCents,
      });

      console.log('Received clientSecret:', clientSecret);

      // Confirm the payment using the Stripe API
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

        // Save order details to Firebase
        const db = getDatabase();
        const ordersRef = ref(db, 'orders');
        const newOrderRef = push(ordersRef);

        set(newOrderRef, {
          userId: auth.currentUser?.uid,
          productName: product.name,
          productPrice: product.price,
          productImage: product.image,
          shippingAddress: address,
          date: new Date().toISOString(),
        }).then(() => {
          console.log('Order saved successfully!');
          // Redirect to orders page after successful order
          navigate("/orders");
        }).catch((error) => {
          console.error('Error saving order:', error);
        });
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
    <form onSubmit={handleSubmit}>

      <h2>Complete your Payment</h2>
      <p><strong>Product:</strong> {product.name}</p>
      <p><strong>Price:</strong> {product.price}</p>
      <p><strong>Shipping Address:</strong> {address}</p>

      {/* Stripe card input */}
      <CardElement />

      {/* Submit button */}
      <button type="submit" className="stripe-button" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay ${product.price}`}
      </button>

      {/* Error and success message */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default StripeCheckoutForm;
