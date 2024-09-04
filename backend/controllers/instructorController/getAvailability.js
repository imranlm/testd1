const { Instructor } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

// Get Current Availability
const getAvailability = async (req, res) => {
  try {
    // Connect to the database
    await connectToMongoDB();

    // Find the instructor by their ID (assuming it's stored in req.user.id)
    const instructor = await Instructor.findById(req.user.id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Respond with the instructor's availability
    res.status(200).json({ availability: instructor.availableSlots });
  } catch (error) {
    console.error('Error retrieving availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAvailability
};
