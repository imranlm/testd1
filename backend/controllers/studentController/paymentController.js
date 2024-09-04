const { connectToMongoDB } = require('../../services/authService');
const { Payment } = require('../../model/dbModel');

const getPaymentDetails = async (req, res) => {
    try {
        // Extract email from authenticated user's details
        const userEmail = req.user.email; // Assuming req.user contains the authenticated user's email
        
        // Connect to MongoDB
        await connectToMongoDB();

        // Fetch payments related to the user's email
        const payments = await Payment.find({ email: userEmail }).lean();

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this email' });
        }

        // Prepare the payments details to be sent back
        const paymentDetails = payments.map(payment => ({
            paymentId: payment._id.toString(),
            amount: payment.price.toString(), // Convert Decimal to String
            paidStatus: payment.paidStatus,
            dateTime: payment.dateTime, // ISODate format
            paymentType: payment.paymentType,
            courseName: payment.courseName.map(course => course.title).join(', '),
            duration: payment.duration.map(d => d.duration).join(', '),
            courseId: payment.courseId.map(c => c.id.toString()).join(', '),
            expiryDate: payment.expiryDate.map(e => e.date).join(', ')
        }));

        // Send the payments detail response
        res.status(200).json({ payments: paymentDetails });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getPaymentDetails };
