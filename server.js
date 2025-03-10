const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51R1Ay32MerSSQ4SSeQvN0vkwMjKx4qE4DKxNFeCd9kUEC17mb7glCEKRjzNFcNpPN924Tx3agDyjkdfoypAhHpKW00YRD4PmT1');

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.send('Stripe Payment Server is Running');
});

// Create payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Handle successful payments
app.post('/payment-success', async (req, res) => {
  try {
    const { paymentIntentId, orderDetails } = req.body;

    // Verify the payment was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Here you would typically:
      // 1. Update your database
      // 2. Send confirmation emails
      // 3. Update inventory
      // 4. etc.

      res.json({ success: true, message: 'Payment processed successfully' });
    } else {
      throw new Error('Payment was not successful');
    }
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: 'Failed to process payment success' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});