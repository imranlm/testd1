const { Instructor } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

// Get Current Availability
const getInstructorAvailability = async (req, res) => {
  try {
    // Connect to the database
    await connectToMongoDB();

    // Find the first (and only) instructor in the collection
    const instructor = await Instructor.findOne({});

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
  getInstructorAvailability
};
