import React, { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from "@paypal/react-paypal-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import Navbar from "../styles/Navbar";
import Footer from "../LandingPage/Footer";
import axios from "axios";

function Message({ content }) {
  return <p className="text-center text-red-500">{content}</p>;
}

function Payment() {
  const initialOptions = {
    "client-id":
      "ATGlhVtnoiBx-R5iZYujoTcLdYcT3QVj8rTTY7DtARYMoOmSG8zoF3ZpZL2uzkfqxjp8UObuHTiFCBom",
    "disable-funding": "card,credit,paylater", // Disable credit card and pay later options
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [cookies, setCookie] = useCookies(["PMI-cart"]);
  console.log(cookies["PMI-cart"]);

  const cartItems = cookies["PMI-cart"].map((item) => ({
    name: item.title,
    unit_amount: {
      currency_code: "USD",
      value: item.price,
    },
    quantity: "1",
  }));
console.log(cartItems)
  const handleCheckout = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`http://localhost:5000/payment/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }), // Include cart items and email in the body
      });
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  

  return (
    <div>
      <Navbar textColor="text-blue-800" />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="container mx-auto p-4">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col lg:flex-row gap-6">
            {/* Left Side: Cart Items */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

              {cookies["PMI-cart"]?.map((item, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-700">
                    Price: ${item.price}
                  </p>
                  <p className="text-gray-700">Duration: {item.duration}</p>
                </div>
              ))}
            </div>

            {/* Right Side: Payment Options */}
            <div className="flex-1 flex flex-col gap-4">
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  style={{
                    shape: "rect",
                    layout: "vertical",
                    height: 40,
                    width: "100%",
                    tagline: false,
                  }}
                  fundingSource={FUNDING.PAYPAL} // Specify PayPal as the only funding source
                  createOrder={async () => {
                    try {
                      setLoading(true); // Start loading
                      const response = await fetch(
                        `http://localhost:5000/payment/api/orders`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ cart: cartItems }), // Send cartItems as part of the body
                          // body: cookies["PMI-cart"].map((item) => ({
                          //   name: item.title,
                          //   unit_amount: {
                          //     currency_code: "USD",
                          //     value: item.price.toFixed(2),
                          //   },
                          //   quantity: "1",
                          // })),
                        }
                      );
                      const orderData = await response.json();
                      setLoading(false); // Stop loading

                      if (orderData.id) {
                        return orderData.id;
                      } else {
                        const errorDetail = orderData?.details?.[0];
                        const errorMessage = errorDetail
                          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                          : JSON.stringify(orderData);

                        throw new Error(errorMessage);
                      }
                    } catch (error) {
                      console.error(error);
                      setMessage(
                        `Could not initiate PayPal Checkout...${error}`
                      );
                      setLoading(false); // Stop loading
                    }
                  }}
                  onApprove={async (data, actions) => {
  try {
    // Capture the order
    const response = await fetch(
      `http://localhost:5000/payment/api/orders/${data.orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const orderData = await response.json();
    console.log(orderData);

    const errorDetail = orderData?.details?.[0];

    if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
      return actions.restart(); // Restart the payment process if the instrument was declined
    } else if (errorDetail) {
      throw new Error(
        `${errorDetail.description} (${orderData.debug_id})`
      );
    } else {
      // Extracting necessary details for the data object
      const transaction = orderData.purchase_units[0].payments.captures[0];
      const email = orderData.payer.email_address;
      const courseName = "Course Name"; // Replace this with the actual course name you're processing
      const price = `${transaction.amount.value} ${transaction.amount.currency_code}`;
      const paidStatus = transaction.status;
      const paymentId = transaction.id;
      const dateTime = new Date(transaction.create_time).toLocaleString();
      const paymentType = transaction.amount.currency_code; // Add payment type (currency)

      const paymentData = {
        courseName:cartItems.map((item)=>{
          return item.name
        }),
        email: email,
        // courseName: courseName,
        price: price,
        paidStatus: paidStatus,
        paymentId: paymentId,
        dateTime: dateTime,
        paymentType: paymentType, // Include payment type
      };
      console.log("Payment Data", paymentData);
      const response=  await axios.post(`http://localhost:5000/payment/setPaymentDetails`,paymentData);
      console.log(response);

      // setMessage(
      //   `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
      // );

      // Redirect to the success page with payment details
      // window.location.href = `/success?orderID=${data.orderID}&paymentType=paypal`;
    }
  } catch (error) {
    console.error(error);
    setMessage(`Sorry, your transaction could not be processed...${error}`);
  }
}}

                />
              </PayPalScriptProvider>

              <div className="text-center">
                <button
                  onClick={handleCheckout}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600 flex items-center justify-center"
                  disabled={loading} // Disable button during loading or if email is not provided
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  )}
                  {loading ? "Processing..." : "Use cards and other"}
                </button>
              </div>

              <Message content={message} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Payment;
