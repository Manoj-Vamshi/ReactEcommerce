// server.js (Backend)

const express = require('express');
const stripe = require('stripe')('sk_test_51QPSYoFSkIgZioxSuwQgxQzI2IgEhndKETMGQwth38GlsHcbGSMgreOmmMycBs0F2Rp4fcd2D5qwBphJiGBci6Ra00np7Zmfca');  // Replace with your secret key
const cors = require('cors');  // For enabling CORS

const app = express();
const port = 4000;

// Enable CORS for frontend communication
app.use(cors());
app.use(express.json());  // Parse JSON requests

// Route to create payment intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount sent from frontend (in cents)

  try {
    // Create a payment intent with the amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',  // Adjust to your preferred currency
    });

    // Respond with the clientSecret for frontend to confirm the payment
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: 'Error creating payment intent' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
