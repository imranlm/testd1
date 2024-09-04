const { Instructor } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');
const mongoose = require('mongoose');
const {ObjectId}=require('mongodb');

// Controller function to delete an availability slot
const deleteAvailability = async (req, res) => {
  try {
    const { slotId } = req.params;

    // Ensure slotId is a valid ObjectId
    const id = new ObjectId(slotId);

 
    await connectToMongoDB();

    // Find the instructor who has the availability slot with the given slotId
    const instructor = await Instructor.findOne({
      'availableSlots.times._id':id
    });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor or availability slot not found' });
    }

    // Update the instructor document by removing the slot with the matching slotId
    await Instructor.updateOne(
      {
        'availableSlots.times._id': id
      },
      {
        $pull: { 
          'availableSlots.$.times': { _id: (id) }
        }
      }
    );

    res.status(200).json({ message: 'Availability slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability slot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  deleteAvailability
};
