import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Modal from './Components/styles/Modal';
import axios from 'axios';

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (sessionId) {
        try {
          // Fetch the result from the backend
          const response = await fetch(`http://localhost:5000/payment/complete?session_id=${sessionId}`);
          const result = await response.json();
          console.log(result);

          if (response.ok) {
            const response = await axios.post('http://localhost:5000/payment/setPaymentDetails', result);
            console.log(response);

            // Set payment details for display
            setPaymentDetails(result);
            setShowModal(true); // Show modal when payment is successful
          } else {
            setError('There was an error processing your payment.');
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching payment result:', error);
          setError('There was an error processing your payment.');
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
        
          {showModal && (
            <Modal 
              message={`Thank you for your purchase! You have successfully paid ${paymentDetails.price} for the course(s): ${paymentDetails.courseName.join(', ')}.`}
              onClose={handleCloseModal} // Use the handler here
              title={"Payment Successful"}
            />
          )}
          
          {/* <h2>Payment Successful</h2>
          <p><strong>Message:</strong> {paymentDetails.message || 'Your payment was successful.'}</p>
          <p><strong>Email:</strong> {paymentDetails.email}</p>
          <p><strong>Payment Status:</strong> {paymentDetails.paidStatus}</p>
          <p><strong>Amount Paid:</strong> {paymentDetails.price}</p>
          <p><strong>Course Title(s):</strong> {paymentDetails.courseName.join(', ')}</p> */}
        </div>
      )}
    </div>
  );
};

export default Success;
