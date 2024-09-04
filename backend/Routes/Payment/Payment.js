const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const path = require('path');


const stripe = require('stripe')("sk_test_51NqwwXJKcOK4e5vDzhs8CIbQJOGfT3k876mvS24K4A14w1CO6KQVJDFfivMRlomQvSrZgt0R5ell0Hc6ZHHgsyn2008aHZ3UoA");
const PAYPAL_CLIENT_ID="ATGlhVtnoiBx-R5iZYujoTcLdYcT3QVj8rTTY7DtARYMoOmSG8zoF3ZpZL2uzkfqxjp8UObuHTiFCBom"
const PAYPAL_CLIENT_SECRET="EPd5czXnNyEKvZYqaUyGf-H6zzaMGG_76nhaYmQAgNMKkJdRtQipTz4omXPRsOUTYmFLMz5qq4g14BFA"

const base = "https://api-m.sandbox.paypal.com";
const router=express.Router();



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
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart,
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "40.00",
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
                  name: item.name, // Use the course name
              },
              unit_amount: item.price * 100, // Stripe expects amount in cents
          },
          quantity: 1, // Since courses typically have no units
      }));

      const session = await stripe.checkout.sessions.create({
          line_items: lineItems,
          mode: 'payment',
          success_url: `https://payment-backend-uzml.onrender.com/complete?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `https://payment-frontend-8w3x.onrender.com`,
      });

      res.json({ url: session.url });
  } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send('Server error');
  }
});

router.get('/complete', async (req, res) => {
    try {
      const result = await Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
        stripe.checkout.sessions.listLineItems(req.query.session_id),
      ]);
  
      console.log(JSON.stringify(result));
      res.send('Your payment was successful');
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
