const {Instructor}=require('../../model/dbModel');
const {connectToMongoDB}=require('../../services/authService')
// Set Availability
const setAvailability = async (req, res) => {
  const { days, startTime, endTime } = req.body;
console.log(req.body)
  try {
    // Find the instructor by their ID (assuming it's stored in req.user.id)
    await connectToMongoDB();
    const instructor = await Instructor.findById(req.user.id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Update or add new availability
    days.forEach(day => {
      const existingDaySlot = instructor.availableSlots.find(slot => slot.day === day);

      if (existingDaySlot) {
        existingDaySlot.times.push({
          start: startTime, // Use a base date if only time is provided
          end: endTime
        });
      } else {
        instructor.availableSlots.push({
          day,
          times: [{
            start: startTime,
            end: endTime
          }]
        });
      }
    });

    await instructor.save();

    res.status(200).json({ message: 'Availability set successfully' });
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Current Availability
exports.getAvailability = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.status(200).json({ availability: instructor.availableSlots });
  } catch (error) {
    console.error('Error retrieving availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Booked Slot
exports.bookSlot = async (req, res) => {
  const { date, startTime, endTime, studentId, studentEmail } = req.body;

  try {
    const instructor = await Instructor.findById(req.user.id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Find the correct slot and update it
    let slotFound = false;
    instructor.availableSlots.forEach(daySlot => {
      daySlot.times.forEach(slot => {
        if (
          slot.start.toISOString() === new Date(`1970-01-01T${startTime}:00Z`).toISOString() &&
          slot.end.toISOString() === new Date(`1970-01-01T${endTime}:00Z`).toISOString()
        ) {
          slot.bookedBy = { studentId, studentEmail };
          slotFound = true;
        }
      });
    });

    if (!slotFound) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    await instructor.save();

    res.status(200).json({ message: 'Slot booked successfully' });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports={
    setAvailability
}