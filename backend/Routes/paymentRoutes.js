const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');
const {storePaymentDetails}=require('../controllers/Payments/setPaymentDetails');

const stripe = require('stripe')("sk_test_51NqwwXJKcOK4e5vDzhs8CIbQJOGfT3k876mvS24K4A14w1CO6KQVJDFfivMRlomQvSrZgt0R5ell0Hc6ZHHgsyn2008aHZ3UoA");
const PAYPAL_CLIENT_ID="ATGlhVtnoiBx-R5iZYujoTcLdYcT3QVj8rTTY7DtARYMoOmSG8zoF3ZpZL2uzkfqxjp8UObuHTiFCBom"
const PAYPAL_CLIENT_SECRET="EPd5czXnNyEKvZYqaUyGf-H6zzaMGG_76nhaYmQAgNMKkJdRtQipTz4omXPRsOUTYmFLMz5qq4g14BFA"

const base = "https://api-m.sandbox.paypal.com";
const router=express.Router();


router.post('/setPaymentDetails',storePaymentDetails);
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const createOrder = async (cart) => {
  console.log("shopping cart information passed from the frontend createOrder() callback:", cart);

  // Calculate the total value of the cart
  const totalValue = cart.reduce((sum, item) => {
    return sum + parseFloat(item.unit_amount.value) * parseInt(item.quantity, 10);
  }, 0).toFixed(2);

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    description:cart.map((item)=>{
        return item.name
    }),

    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalValue,  // Set the total cart value dynamically
        },
      },
    ],
    application_context: {
      shipping_preference: "NO_SHIPPING", // This line prevents shipping details from being included
    },
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

router.post("/api/orders", async (req, res) => {
    console.log(req.body)
  try {
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

router.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

router.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/dist/index.html"));
});
router.post('/checkout', async (req, res) => {
  const { cartItems } = req.body; // Extract cart items from the request body
  console.log(cartItems);
  try {
      // Dynamically create the line items based on the cart items
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: parseFloat(item.unit_amount.value) * 100, // Convert value to cents
        },
        quantity: parseInt(item.quantity, 10), // Convert quantity to integer
      }));

      const session = await stripe.checkout.sessions.create({
          line_items: lineItems,
          mode: 'payment',
           success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
      });

      res.json({ url: session.url });
  } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send('Server error');
  }
});

router.get('/complete', async (req, res) => {
    console.log(req.query);
    try {
        // Retrieve the session and line items from Stripe
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id, { 
            expand: ['payment_intent.payment_method'] 
        });
        const lineItems = await stripe.checkout.sessions.listLineItems(req.query.session_id);

        // Extract relevant information
        const paymentIntent = session.payment_intent;
        const customerEmail = session.customer_details ? session.customer_details.email : null;
        const paymentStatus = session.payment_status ? session.payment_status.toUpperCase() : 'UNDEFINED'; // Ensure payment status is in uppercase
        const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00'; // Convert amount from cents to dollars and format to 2 decimal places
        const currency = session.currency ? session.currency.toUpperCase() : 'USD'; // Ensure the currency is in uppercase
        const courseName = lineItems.data.map(item => item.description); // Array of course titles
        const paymentDateTime = new Date(session.created * 1000).toLocaleString(); // Convert Unix timestamp to a human-readable format
        const paymentId = paymentIntent ? paymentIntent.id : 'UNDEFINED'; // Payment ID

        // Format the payment data as required
        const paymentData = {
            courseName: courseName, // Array of course titles
            dateTime: paymentDateTime, // Date and time of payment
            email: customerEmail, // Customer's email
            paidStatus: paymentStatus, // Payment status
            paymentId: paymentId, // Payment ID
            paymentType: currency, // Payment currency type (e.g., USD)
            price: `${amountPaid} ${currency}` // Formatted price with currency
        };

        // Send the formatted payment data back to the frontend
        res.json(paymentData);
    } catch (error) {
        console.error('Error completing payment:', error);
        res.status(500).send('Server error');
    }
});


  
router.get('/cancel', (req, res) => {
    res.redirect('/');
});

module.exports=router

// router.post('/create-payment-intent', async (req, res) => {
//   try {
//     const { items } = req.body;

//     // Calculate the total amount based on the items
//     const amount = items.reduce((sum, item) => sum + item.price * 100, 0);

//     // Create a PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//       payment_method_types: ['card'],
//       // Add payment_method_options if necessary for specific methods
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error creating PaymentIntent:', error);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/create-payment-intent', async (req, res) => {
//   try {
//     const { items } = req.body;
//     const line_items = items.map(item => ({
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 10, // Stripe uses the smallest currency unit
//       },
//       quantity: 1,
//     }));

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: line_items.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0),
//       currency: 'usd',
//       payment_method_types: ['card', 'google_pay', 'apple_pay'],
//       confirm: true,
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error creating PaymentIntent:', error);
//     res.status(500).send('Server error');
//   }
// });
